# # config.py

# import os

# class Config:
#     SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'
#     SQLALCHEMY_DATABASE_URI = 'mysql://root@127.0.0.1:3306/property_name'
#     SQLALCHEMY_TRACK_MODIFICATIONS = False

# config.py

import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'you-will-never-guess'
    SQLALCHEMY_DATABASE_URI = 'mysql://root:admin@localhost/property_name'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
