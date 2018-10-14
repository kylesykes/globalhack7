import random
from copy import deepcopy

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
    return random.choice(['314', '636', '618', '217']) + str(fake.pydecimal(left_digits=10, right_digits=0, positive=True))[:7]


def generate_skills(n=3):
    return [fake.job() for _ in range(n)]


def generate_lang():
    return random.choice(['Spanish', 'English'])


def generate_un():
    return fake.user_name()


# #### Genereate objects

milestones_list = {'drivers_license':
                    {'description': 'To the DMV and get a drivers license',
                     'name': 'Driver\'s License',
                     'ms_id': '1',
                     'steps': [('Step One', 'The First Step'),
                               ('Step Two', 'The Second Step'),
                               ('Step Three', 'The Third Step')]
                    },
                'apply_for_loan':
                    {'description': 'Apply for a loan',
                     'name': 'Loan',
                     'ms_id': '2',
                     'steps': [('Step One', 'The First Step'),
                               ('Step Two', 'The Second Step'),
                               ('Step Three', 'The Third Step'),
                               ('Step Four', 'The Fourth Step')]
                    },
                'get_license':
                    {'description': 'Get commerical license',
                     'name': 'Get license',
                     'ms_id': '3',
                     'steps': [('Step One', 'The First Step'),
                               ('Step Two', 'The Second Step'),
                               ('Step Three', 'The Third Step'),
                               ('Step Four', 'The Fourth Step')]
                    },
                'apply_for_permit':
                    {'description': 'Apply for a permit',
                     'name': 'Permit',
                     'ms_id': '4',
                     'steps': [('Step One', 'The First Step'),
                               ('Step Two', 'The Second Step')]
                    },
                'find_a_store':
                    {'description': 'Find a store suitable to your desired business.',
                     'name': 'Find a store',
                     'ms_id': '5',
                     'steps': [('Step One', 'The First Step'),
                               ('Step Two', 'The Second Step'),
                               ('Step Three', 'The Third Step'),
                               ('Step Four', 'The Fourth Step')]
                    },
                'financial_basics':
                    {'description': 'Learn about financial basics.',
                     'name': 'Financial basics',
                     'ms_id': '6',
                     'steps': [('Step One', 'The First Step'),
                               ('Step Two', 'The Second Step'),
                               ('Step Three', 'The Third Step')]
                    },
                'government_id':
                    {'description': 'Obtain a government ID.',
                     'name': 'Goverment ID',
                     'ms_id': '7',
                     'steps': [('Step One', 'The First Step'),
                               ('Step Two', 'The Second Step'),
                               ('Step Three', 'The Third Step')]
                    },
                'job_posting':
                    {'description': 'Review job posting.',
                     'name': 'Job postings',
                     'ms_id': '8',
                     'steps': [('Step One', 'The First Step'),
                               ('Step Two', 'The Second Step')]
                    },
                'apply_for_job':
                    {'description': 'Apply to job postings.',
                     'name': 'Apply for jobs',
                     'ms_id': '9',
                     'steps': [('Step One', 'The First Step'),
                               ('Step Two', 'The Second Step'),
                                ('Step Three', 'The Third Step')]
                    },
                'prepare_for_interview':
                    {'description': 'Prepare for job interview.',
                     'name': 'Prepare for interview',
                     'ms_id': '10',
                     'steps': [('Step One', 'The First Step'),
                               ('Step Two', 'The Second Step'),
                               ('Step Three', 'The Third Step'),
                               ('Step Four', 'The Fourth Step')]
                    },
                'apply_for_cc':
                    {'description': '.',
                     'name': 'Obtain credit card',
                     'ms_id': '11',
                     'steps': [('Step One', 'The First Step'),
                               ('Step Two', 'The Second Step')]
                    }
                }


goals_list = {'start_business': {'g_id': '1',
                            'name': 'Start a business',
                            'description': 'Start a your own business.',
                            'milestones': ['2', '3', '4', '5', '6'],
                            'tags': ['Financial']
                            },
              'find_job': {'g_id': '2',
                            'name': 'Find a job',
                            'description': 'Find a job within your skillset.',
                            'milestones': ['7', '8', '9', '10'],
                            'tags': ['Financial']
                            },
              'banking_basics': {'g_id': '3',
                            'name': 'Learn US banking basics',
                            'description': 'Learn how to use the US banking system.',
                            'milestones': ['6', '7', '2'],
                            'tags': ['Financial']
                            },
              'built_credit': {'g_id': '4',
                            'name': 'Build credit',
                            'description': 'Build up your credit score.',
                            'milestones': ['6', '11', '2'],
                            'tags': ['Financial']
                            },
              'public_trans': {'g_id': '5',
                            'name': 'Use public transportation',
                            'description': 'Use public transportation.',
                            'milestones': [],
                            'tags': ['Transportation']
                            },
              'buy_car': {'g_id': '6',
                            'name': 'Buy a car',
                            'description': 'Shop for and buy a car.',
                            'milestones': [],
                            'tags': ['Transportation']
                            }

             }


def generate_step(name, desc, in_progress=False, complete=False):
    return {
             'complete': complete,
             'description': desc,
             'in_progress': in_progress,
             'name': name}


def generate_steps(milestone, n_steps=3):
    # Get the milestone to generate steps from.
    ms = milestones_list[milestone]
    steps = ms['steps']
    # Determine the current step.
    cur_step = random.randint(0, len(steps) + 1)
    steps_list = []
    for i in range(0, len(steps)):
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
    ms = milestones_list[milestone]
    r = {
         'description': ms['description'],
         'name': ms['name'],
         'steps': generate_steps(milestone=milestone),
         'in_progress': False,
         'completed': False,
         'chats': []
     }
    return r


def generate_milestones(n=None, max_n=3):
    if n is None:
        n = random.randint(1, max_n)
    return [generate_milestone(ms) for ms in random.choices(list(milestones_list.keys()), k=n)]


def get_milestone_by_id(_id):
    for k, m in milestones_list.items():
        if m['ms_id'] == _id:
            return generate_milestone(k)


def generate_goal(goal):
    g = deepcopy(goals_list[goal])
    g['milestones'] = [get_milestone_by_id(i) for i in g['milestones']]
    g['in_progress'] = False
    g['completed'] = False
    return g


def generate_goals(n=None, max_n=2):
    if n is None:
        n = random.randint(0, max_n)
    return [generate_goal(g) for g in random.choices(list(goals_list.keys()), k=n)]  


def generate_goals_all():
    return [generate_goal(g) for g in goals_list]


### API

def generate_user():
    return {
         'createdAt': generate_ts(),
         'hasMentor': random.choice([True, False]),
         'goals': generate_goals(),
         'phone': generate_phone(),
         'profile': {'age': random.randint(18, 70),
                     'gender': str(random.randint(0,1)),
                     'language': generate_lang(),
                     'skills': generate_skills()
                    },
         'updatedAt': generate_ts(),
         'username': generate_un(),
         'password': 'password'}


def generate_users(num=10):
    data = [generate_user() for _ in range(int(num))]
    # Fix phone number for one user
    data[0]['phone'] = '3141111111'
    data[1]['goals'] = []
    return data


def get_goals():
    goals = []
    for g in goals_list.values():
        temp = dict(g)
        goals.append(temp)
    return goals


def get_milestones():
    ms = []
    for m in milestones_list.values():
        temp = dict(m)
        ms.append(temp)
    return ms


### Main

if __name__=='__main__':
    import sys
    import json
    num = sys.argv[1]
    #data = [generate_user() for _ in range(int(num))]
    #data[0]['phone'] = '3141111111'
    data = generate_users(num)
    json.dump(data, open('users.json', 'w'))
