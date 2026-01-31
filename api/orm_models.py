import os
from peewee import SqliteDatabase, Model, CharField, IntegerField, TextField, ManyToManyField

# Get the directory of the current file
current_dir = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(current_dir, 'movies-extended.db')

db = SqliteDatabase(db_path)

class BaseModel(Model):

    class Meta:
        database = db

class Actor(BaseModel):
    id = IntegerField(primary_key=True)
    name = CharField()
    surname = CharField()

    class Meta:
        indexes = (
            (('name', 'surname'), True),  # True means unique index
        )

class Movie(BaseModel):
    id = IntegerField(primary_key=True)
    title = CharField()
    director = CharField()
    year = IntegerField()
    description = TextField()
    actors = ManyToManyField(Actor, backref='movies')
