from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, SelectField
from wtforms.validators import InputRequired, EqualTo, NumberRange, Length
#Length with help from https://wtforms.readthedocs.io/en/2.3.x/validators/

class RegistrationForm(FlaskForm):
    user_id = StringField("User ID:",validators=[InputRequired(),Length(min=4,max=20)])
    password = PasswordField("Password:",validators=[InputRequired(), Length(min=4,max=20)])
    password2 = PasswordField("Confirm Password:",validators=[InputRequired(), EqualTo("password")])
    submit = SubmitField("Submit")

class LoginForm(FlaskForm):
    user_id = StringField("User ID:",validators=[InputRequired()])
    password = PasswordField("Password:",validators=[InputRequired()])
    submit = SubmitField("Submit")

class RateForm(FlaskForm):
    rate = SelectField("Do you like this game?",choices=[("yes","Yes"),
                                                        ("no","No")])
    submit = SubmitField("Submit")