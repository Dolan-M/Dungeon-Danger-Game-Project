from flask import Flask, render_template, request, jsonify, g, session, redirect, url_for, make_response
from forms import RegistrationForm, LoginForm, RateForm
from datetime import datetime
from database import get_db, close_db
from flask_session import Session
from werkzeug.security import generate_password_hash, check_password_hash
from functools import wraps

app = Flask(__name__)
app.config["SECRET_KEY"] = "this-is-my-secret-key"
app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
Session(app)

@app.teardown_appcontext
def close_db_at_end_of_requests(e=None):
    close_db(e)

@app.before_request
def load_logged_in_user():
    g.user = session.get("user_id",None)

def login_required(view):
    @wraps(view)
    def wrapped_view(**kwargs):
        if g.user is None:
            return redirect(url_for("login", next=request.url))
        return view(**kwargs)
    return wrapped_view

@app.errorhandler(404)
def page_not_found(error):
    return render_template("error404.html", page="Error!"), 404

@app.route("/")
def index():
    current_date = datetime.now().strftime("%d %B %Y")
    return render_template("index.html", current_date=current_date, page="Home")

@app.route("/register", methods=["GET","POST"])
def register():
    form = RegistrationForm()
    if form.validate_on_submit():
        user_id = form.user_id.data
        user_id = user_id.lower()
        password = form.password.data
        password2 = form.password2.data
        profanity = ["fuck","bitch","cunt","fucker","shithead","dick","shit","pharaoh","asshole","crap","idiot","bastard","bollocks","wanker","twat","whore"]
        if user_id in profanity:
            form.user_id.errors.append("User ID invalid.")
        else:
            db = get_db()
            user = db.execute(''' SELECT * FROM users
                                    WHERE user_id = ?;''',(user_id,)).fetchone()
            if user is None:
                db.execute('''INSERT INTO users (user_id,password)
                            VALUES (?,?);''',(user_id,generate_password_hash(password)))
                db.commit()
                db.execute(''' INSERT INTO leaderboard (user_id,score)
                                VALUES (?,?);''',(user_id,0))
                db.commit()
                return redirect(url_for("login"))
            elif user is not None:
                form.user_id.errors.append("User ID already taken.")
    return render_template("register.html", form=form, page="Register")

@app.route("/login", methods=["GET","POST"])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user_id = form.user_id.data
        user_id = user_id.lower()
        password = form.password.data
        db = get_db()
        user = db.execute(''' SELECT * FROM users
                                WHERE user_id = ?;''',(user_id,)).fetchone()
        if user is None:
            form.user_id.errors.append("Unknown User ID.")
        elif not check_password_hash(user["password"],password):
            form.password.errors.append("Incorrect password!")
        else:
            session.clear()
            session["user_id"] = user_id
            next_page = request.args.get("next")
            if not next_page:
                next_page = url_for("index")
            return redirect(next_page)
    return render_template("login.html", form=form, page="Login")

@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("index"))

@app.route("/about")
def about():
    return render_template("about.html", page="About")


@app.route("/game")
@login_required
def game():
    return render_template("game.html", page="Game")

@app.route("/leaderboard")
@login_required
def leaderboard():
    db = get_db()
    leaderboard = db.execute(''' SELECT * FROM leaderboard
                                ORDER BY score DESC;''')
    return render_template("leaderboard.html", page="Leaderboard", leaderboard=leaderboard)

@app.route("/rate", methods=["GET","POST"])
@login_required
def rate():
    db = get_db()
    form = RateForm()
    user = db.execute('''SELECT user_id from likes WHERE user_id=?;''',(g.user,)).fetchone()
    if user is not None:
            if request.cookies.get("rated")=="yes":
                return render_template("cookie.html", message="Sorry! You already made a rating.")
    else:
        if form.validate_on_submit():
            rate = form.rate.data
            db.execute(''' INSERT INTO likes (user_id)
                            VALUES (?);''',(g.user,))
            db.commit()
            checkyes = db.execute(''' SELECT yes FROM likes;''').fetchone()
            checkno = db.execute(''' SELECT nope FROM likes;''').fetchone()
            if rate == "yes":
                if checkyes is None:
                    db.execute(''' INSERT INTO likes (yes)
                                    VALUES (?);''',(1,))
                    db.commit()
                elif checkyes is not None:
                    db.execute(''' UPDATE likes
                                    SET yes=yes + ?;''',(1,))
                    db.commit()
            elif rate == "no":
                if checkno is None:
                    db.execute(''' INSERT INTO likes (nope)
                                    VALUES (?);''',(1,))
                    db.commit()
                elif checkno is not None:
                    db.execute(''' UPDATE likes
                                    SET nope=nope + ?;''',(1,))
                    db.commit()
            response = make_response(render_template("cookie.html",message="Thanks for your rating!"))
            response.set_cookie("rated","yes",max_age=5*365*24*60*60)
            return response
    return render_template("rate.html",page="Rate Game",form=form)


@app.route("/get_num_likes")
def get_num_likes():
    #db= get_db()
    #num_likes = db.execute('''SELECT * FROM likes;''').fetchone()["yes"]
    from random import randint
    num_likes = randint(0,100)
    return jsonify({"count": num_likes})

            

@app.route("/store_score", methods=["POST"])
def store_score():
    score = int(request.form["score"])
    db = get_db()
    db.execute(''' UPDATE leaderboard
                    SET score=?
                    WHERE user_id=?
                    AND ?>score;''',(score,g.user,score))
    db.commit()
    return "success"