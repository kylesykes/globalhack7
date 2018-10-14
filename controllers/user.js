const { promisify } = require("util");
const mongoose = require("mongoose");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const passport = require("passport");
const User = require("../models/User");
const getPhone = require("../config/strip_phone");
const randomBytesAsync = promisify(crypto.randomBytes);
const Goal = require("../models/Goal");
const async = require("async");

exports.getUser = (req, res, next) => {
  User.User.findOne({ phone: req.params.phone }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(404).send("Not found");
    }
    res.send(user);
  });
};

/**
 * POST /login
 * Sign in using email and password.
 */
exports.postLogin = (req, res, next) => {
  req.assert("phone", "Phone is not valid").isMobilePhone();
  req.assert("password", "Password cannot be blank").notEmpty();

  const errors = req.validationErrors();

  if (errors) {
    req.flash("errors", errors);
    return res.redirect("/login");
  }

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      req.flash("errors", info);
      return next(err);
    }
    if (!user) {
      req.flash("errors", info);
      return res.redirect("/login");
    }
    if (user.password)
      req.logIn(user, err => {
        if (err) {
          return next(err);
        }

        delete user.password;
        res.send(user);
      });
  })(req, res, next);
};

/**
 * POST /signup
 * Create a new local account.
 */
exports.postSignup = (req, res, next) => {
  req.assert("phone", "Phone is not valid").isMobilePhone();
  req.assert("password", "Password must be at least 4 characters long").len(4);
  req
    .assert("confirmPassword", "Passwords do not match")
    .equals(req.body.password);

  const errors = req.validationErrors();

  if (errors) {
    req.flash("errors", errors);
    return res.redirect("/signup");
  }

  let strippedPhone = getPhone(req.body.phone);
  req.body.phone = strippedPhone;
  const user = new User.User(req.body);

  User.User.findOne({ phone: req.body.phone }, (err, existingUser) => {
    if (err) {
      return next(err);
    }
    if (existingUser) {
      req.flash("errors", {
        msg: "Account with that phone already exists."
      });
      return res.send({ error: "User Already Exists" });
    }
    user.save(err => {
      if (err) {
        return next(err);
      }
      req.logIn(user, err => {
        if (err) {
          return next(err);
        }

        delete user.password;
        res.send(user);
      });
    });
  });
};

exports.completeGoal = (req, res, next) => {
  let userId = req.body.id;
  let goalId = req.body.goalId;

  User.User.findOneAndUpdate(
    { _id: userId, "goals.g_id": goalId },
    {
      $set: {
        "goals.$.completed": true
      }
    },
    (err, user) => {
      if (err) {
        console.error(err);
        return next(err);
      }
      res.send(user);
    }
  );
};

exports.completeMilestone = (req, res, next) => {
  let userId = req.body.id;
  let goalId = req.body.goalId;
  let milestoneId = req.body.milestoneId;

  User.User.findOne({ _id: userId }, (err, user) => {
    if (err) {
      console.error(err);
      return next(err);
    }

    var foundMilestone;
    async.each(
      user.goals,
      function(goal, cb) {
        if (goal.g_id !== goalId) {
          cb();
        } else {
          async.each(
            goal.milestones,
            function(milestone, callback) {
              if (milestone.muid == milestoneId) {
                foundMilestone = milestone;
              }
              callback();
            },
            function(err) {
              if (err) {
                return cb(err);
              }
              return cb();
            }
          );
        }
      },
      function(err) {
        if (err) {
          return next(err);
        }
        if (!foundMilestone) {
          return res
            .status(404)
            .send("An error occurred finding milestone or goal");
        }
        foundMilestone.completed = true;

        return user.save(function(err, updatedUser) {
          if (err) {
            return next(err);
          }
          return res.send(updatedUser);
        });
      }
    );
  });
};

exports.createMessage = (req, res, next) => {
  let userId = req.body.id;
  let goalId = req.body.goalId;
  let milestoneId = req.body.milestoneId;
  let isResolved = req.body.isResolved;
  let message = req.body.message;

  User.User.findOne({ _id: userId }, (err, user) => {
    if (err) {
      console.error(err);
      return next(err);
    }

    var foundMilestone;
    async.each(
      user.goals,
      function(goal, cb) {
        if (goal.g_id !== goalId) {
          cb();
        } else {
          async.each(
            goal.milestones,
            function(milestone, callback) {
              if (milestone.muid == milestoneId) {
                foundMilestone = milestone;
              }
              callback();
            },
            function(err) {
              if (err) {
                return cb(err);
              }
              return cb();
            }
          );
        }
      },
      function(err) {
        if (err) {
          return next(err);
        }
        if (!foundMilestone) {
          return res
            .status(404)
            .send("An error occurred finding milestone or goal");
        }
        if (!foundMilestone.chat) {
          return res
            .status(404)
            .send("An error occurred accessing foundMilestone Chat");
        }
        foundMilestone.chat.messages.push(message);
        if (isResolved) {
          foundMilestone.chat.isResolved = true;
        }
        return user.save(function(err, updatedUser) {
          if (err) {
            return next(err);
          }
          return res.send(updatedUser);
        });
      }
    );
  });
};

exports.assignGoal = (req, res, next) => {
  let userId = req.body.id;
  let goalId = req.body.goalId;

  User.User.findById(userId, (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(404).send("User not found");
    }
    Goal.GoalTemplate.findOne({ g_id: goalId }, (err, goalTemplate) => {
      if (err) {
        return next(err);
      }
      if (!goalTemplate) {
        return res.status(404).send("GoalTemplateNotFound");
      }
      user.goals.push(goalTemplate);
      user.save((err, updatedUser) => {
        if (err) {
          return next(err);
        }
        res.send(updatedUser);
      });
    });
  });
};

/**
 * ***********************************************************
 * ********************* UNUSED ******************************
 */

/**
 * GET /login
 * Login page.
 */
exports.getLogin = (req, res) => {
  if (req.user) {
    return res.redirect("/");
  }
  res.render("account/login", {
    title: "Login"
  });
};

/**
 * GET /logout
 * Log out.
 */
exports.logout = (req, res) => {
  req.logout();
  req.session.destroy(err => {
    if (err)
      console.log("Error : Failed to destroy the session during logout.", err);
    req.user = null;
    res.redirect("/");
  });
};

/**
 * GET /signup
 * Signup page.
 */
exports.getSignup = (req, res) => {
  if (req.user) {
    return res.redirect("/");
  }
  res.render("account/signup", {
    title: "Create Account"
  });
};

/**
 * GET /account
 * Profile page.
 */
exports.getAccount = (req, res) => {
  res.render("account/profile", {
    title: "Account Management"
  });
};

/**
 * POST /account/profile
 * Update profile information.
 */
exports.postUpdateProfile = (req, res, next) => {
  req.assert("phone", "Please enter a valid phone.").isMobilePhone();

  const errors = req.validationErrors();

  if (errors) {
    req.flash("errors", errors);
    return res.redirect("/account");
  }

  User.User.findById(req.user.id, (err, user) => {
    if (err) {
      return next(err);
    }
    user.email = req.body.email || "";
    user.profile.name = req.body.name || "";
    user.profile.gender = req.body.gender || "";
    user.profile.location = req.body.location || "";
    user.profile.website = req.body.website || "";
    user.save(err => {
      if (err) {
        if (err.code === 11000) {
          req.flash("errors", {
            msg:
              "The email address you have entered is already associated with an account."
          });
          return res.redirect("/account");
        }
        return next(err);
      }
      req.flash("success", { msg: "Profile information has been updated." });
      res.redirect("/account");
    });
  });
};

/**
 * POST /account/password
 * Update current password.
 */
exports.postUpdatePassword = (req, res, next) => {
  req.assert("password", "Password must be at least 4 characters long").len(4);
  req
    .assert("confirmPassword", "Passwords do not match")
    .equals(req.body.password);

  const errors = req.validationErrors();

  if (errors) {
    req.flash("errors", errors);
    return res.redirect("/account");
  }

  User.User.findById(req.user.id, (err, user) => {
    if (err) {
      return next(err);
    }
    user.password = req.body.password;
    user.save(err => {
      if (err) {
        return next(err);
      }
      req.flash("success", { msg: "Password has been changed." });
      res.redirect("/account");
    });
  });
};

/**
 * POST /account/delete
 * Delete user account.
 */
exports.postDeleteAccount = (req, res, next) => {
  User.User.deleteOne({ _id: req.user.id }, err => {
    if (err) {
      return next(err);
    }
    req.logout();
    req.flash("info", { msg: "Your account has been deleted." });
    res.redirect("/");
  });
};

/**
 * GET /account/unlink/:provider
 * Unlink OAuth provider.
 */
exports.getOauthUnlink = (req, res, next) => {
  const { provider } = req.params;
  User.User.findById(req.user.id, (err, user) => {
    if (err) {
      return next(err);
    }
    user[provider] = undefined;
    user.tokens = user.tokens.filter(token => token.kind !== provider);
    user.save(err => {
      if (err) {
        return next(err);
      }
      req.flash("info", { msg: `${provider} account has been unlinked.` });
      res.redirect("/account");
    });
  });
};

/**
 * GET /reset/:token
 * Reset Password page.
 */
exports.getReset = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  User.User.findOne({ passwordResetToken: req.params.token })
    .where("passwordResetExpires")
    .gt(Date.now())
    .exec((err, user) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        req.flash("errors", {
          msg: "Password reset token is invalid or has expired."
        });
        return res.redirect("/forgot");
      }
      res.render("account/reset", {
        title: "Password Reset"
      });
    });
};

/**
 * POST /reset/:token
 * Process the reset password request.
 */
exports.postReset = (req, res, next) => {
  req.assert("password", "Password must be at least 4 characters long.").len(4);
  req.assert("confirm", "Passwords must match.").equals(req.body.password);

  const errors = req.validationErrors();

  if (errors) {
    req.flash("errors", errors);
    return res.redirect("back");
  }

  const resetPassword = () =>
    User.findOne({ passwordResetToken: req.params.token })
      .where("passwordResetExpires")
      .gt(Date.now())
      .then(user => {
        if (!user) {
          req.flash("errors", {
            msg: "Password reset token is invalid or has expired."
          });
          return res.redirect("back");
        }
        user.password = req.body.password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        return user.save().then(
          () =>
            new Promise((resolve, reject) => {
              req.logIn(user, err => {
                if (err) {
                  return reject(err);
                }
                resolve(user);
              });
            })
        );
      });

  const sendResetPasswordEmail = user => {
    if (!user) {
      return;
    }
    let transporter = nodemailer.createTransport({
      service: "SendGrid",
      auth: {
        user: process.env.SENDGRID_USER,
        pass: process.env.SENDGRID_PASSWORD
      }
    });
    const mailOptions = {
      to: user.email,
      from: "hackathon@starter.com",
      subject: "Your Hackathon Starter password has been changed",
      text: `Hello,\n\nThis is a confirmation that the password for your account ${
        user.email
      } has just been changed.\n`
    };
    return transporter
      .sendMail(mailOptions)
      .then(() => {
        req.flash("success", {
          msg: "Success! Your password has been changed."
        });
      })
      .catch(err => {
        if (err.message === "self signed certificate in certificate chain") {
          console.log(
            "WARNING: Self signed certificate in certificate chain. Retrying with the self signed certificate. Use a valid certificate if in production."
          );
          transporter = nodemailer.createTransport({
            service: "SendGrid",
            auth: {
              user: process.env.SENDGRID_USER,
              pass: process.env.SENDGRID_PASSWORD
            },
            tls: {
              rejectUnauthorized: false
            }
          });
          return transporter.sendMail(mailOptions).then(() => {
            req.flash("success", {
              msg: "Success! Your password has been changed."
            });
          });
        }
        console.log(
          "ERROR: Could not send password reset confirmation email after security downgrade.\n",
          err
        );
        req.flash("warning", {
          msg:
            "Your password has been changed, however we were unable to send you a confirmation email. We will be looking into it shortly."
        });
        return err;
      });
  };

  resetPassword()
    .then(sendResetPasswordEmail)
    .then(() => {
      if (!res.finished) res.redirect("/");
    })
    .catch(err => next(err));
};

/**
 * GET /forgot
 * Forgot Password page.
 */
exports.getForgot = (req, res) => {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  res.render("account/forgot", {
    title: "Forgot Password"
  });
};

/**
 * POST /forgot
 * Create a random token, then the send user an email with a reset link.
 */
exports.postForgot = (req, res, next) => {
  req.assert("phone", "Please enter a valid phone number").isMobilePhone();

  const errors = req.validationErrors();

  if (errors) {
    req.flash("errors", errors);
    return res.redirect("/forgot");
  }

  const createRandomToken = randomBytesAsync(16).then(buf =>
    buf.toString("hex")
  );

  const setRandomToken = token =>
    User.findOne({ phone: req.body.phone }).then(user => {
      if (!user) {
        req.flash("errors", {
          msg: "Account with that phone address does not exist."
        });
      } else {
        user.passwordResetToken = token;
        user.passwordResetExpires = Date.now() + 3600000; // 1 hour
        user = user.save();
      }
      return user;
    });

  const sendForgotPasswordEmail = user => {
    if (!user) {
      return;
    }
    const token = user.passwordResetToken;
    let transporter = nodemailer.createTransport({
      service: "SendGrid",
      auth: {
        user: process.env.SENDGRID_USER,
        pass: process.env.SENDGRID_PASSWORD
      }
    });
    const mailOptions = {
      to: user.email,
      from: "hackathon@starter.com",
      subject: "Reset your password on Hackathon Starter",
      text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n
        Please click on the following link, or paste this into your browser to complete the process:\n\n
        http://${req.headers.host}/reset/${token}\n\n
        If you did not request this, please ignore this email and your password will remain unchanged.\n`
    };
    return transporter
      .sendMail(mailOptions)
      .then(() => {
        req.flash("info", {
          msg: `An e-mail has been sent to ${
            user.email
          } with further instructions.`
        });
      })
      .catch(err => {
        if (err.message === "self signed certificate in certificate chain") {
          console.log(
            "WARNING: Self signed certificate in certificate chain. Retrying with the self signed certificate. Use a valid certificate if in production."
          );
          transporter = nodemailer.createTransport({
            service: "SendGrid",
            auth: {
              user: process.env.SENDGRID_USER,
              pass: process.env.SENDGRID_PASSWORD
            },
            tls: {
              rejectUnauthorized: false
            }
          });
          return transporter.sendMail(mailOptions).then(() => {
            req.flash("info", {
              msg: `An e-mail has been sent to ${
                user.email
              } with further instructions.`
            });
          });
        }
        console.log(
          "ERROR: Could not send forgot password email after security downgrade.\n",
          err
        );
        req.flash("errors", {
          msg:
            "Error sending the password reset message. Please try again shortly."
        });
        return err;
      });
  };

  createRandomToken
    .then(setRandomToken)
    .then(sendForgotPasswordEmail)
    .then(() => res.redirect("/forgot"))
    .catch(next);
};
