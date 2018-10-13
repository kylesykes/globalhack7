import random

from bson.objectid import ObjectId
import faker


fake = faker.Faker('en_US')

# Generate basics

def generate_ts():
    dt = fake.date_time_this_month(before_now=True, after_now=False, tzinfo=None)
    return str(dt).replace(' ', 'T') + '.000Z'


def generate_id(n=24):
    return str(ObjectId())


def generate_phone():
    return random.choice(['314', '636', '618', '217']) + str(fake.pydecimal(left_digits=7, right_digits=0, positive=True))[:7]


def generate_skills(n=3):
    return [fake.job() for _ in range(n)]


def generate_lang():
    return random.choice(['Spanish', 'English'])


def generate_un():
    return fake.user_name()


# #### Genereate objects

content_steps = {'drivers_license':
                    {'desc': 'To the DMV and get a drivers license',
                     'name': 'Driver\'s License',
                     'steps': [('Step One', 'The First Step'),
                               ('Step Two', 'The Second Step'),
                               ('Step Three', 'The Third Step'),
                               ('Step Four', 'The Fourth Step')]
                    }
                }



def generate_step(name, desc, in_progress=False, complete=False):
    return {'_id': generate_id(),
             'complete': complete,
             'description': desc,
             'in_progress': in_progress,
             'name': name}


def generate_steps(milestone, n_steps=3):
    # Get the milestone to generate steps from.
    ms = content_steps[milestone]
    steps = ms['steps']
    # Determine the current step.
    cur_step = random.randint(0, n_steps + 1)
    steps_list = []
    for i in range(0, n_steps):
        cur = steps[i]
        if i + 1 < cur_step:
            # Completed step
            steps_list.append(generate_step(name=cur[0],
                                            desc=cur[1],
                                            in_progress=False,
                                            complete=True))
        elif i + 1 == cur_step:
            # Current step
            steps_list.append(generate_step(name=cur[0],
                                            desc=cur[1],
                                            in_progress=True,
                                            complete=False))
        else:
            # Future step
            steps_list.append(generate_step(name=cur[0],
                                            desc=cur[1],
                                            in_progress=False,
                                            complete=False))
    return steps_list


def generate_milestone(milestone):
    ms = content_steps[milestone]
    n_steps = random.randint(1, 4)
    r = {'_id': generate_id(),
         'description': ms['desc'],
         'name': ms['name'],
         'steps': generate_steps(milestone=milestone, n_steps=n_steps)}
    return r


def generate_milestones(n=None, max_n=3, milestones=None):
    if n is None:
        n = random.randint(1, max_n)
    return [generate_milestone(ms) for ms in random.choices(list(content_steps.keys()), k=n)]


def generate_data():
    return {'__v': 1,
         '_id': generate_id(),
         'createdAt': generate_ts(),
         'mentees': [],
         'mentors': [generate_id()],
         'milestones': generate_milestones(),
         'phone': generate_phone(),
         'profile': {'age': random.randint(18, 70),
          'gender': str(random.randint(0,1)),
          'language': generate_lang(),
          'skills': generate_skills()},
         'updatedAt': generate_ts(),
         'username': generate_un(),
         'password': 'password'}


if __name__=='__main__':
    import sys
    import json
    num = sys.argv[1]
    data = [generate_data() for _ in range(int(num))]
    json.dump(data, open('users.json', 'w'))
