const bcrypt = require('bcrypt');
const passport = require('passport');
const axios = require('axios');

const User = require('../models/user');


exports.login = (req, res) => {
    res.render("login", { pageTitle: "ورود به بخش مدیریت", path: "/login", message: req.flash("success_msg"), error: req.flash("error") })
}

exports.handleLogin = async(req, res, next) => {
    if (!req.body["g-recaptcha-response"]) {
        req.flash("error", "اعتبار سنجی کپچا الزامی میباشد.");
        return res.redirect("/users/login")
    }
    const secretKey = process.env.CAPTCHA_SECRET;
    const verifyURL = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body["g-recaptcha-response"]}&remoteip=${req.connection.remoteAddress}`;
    const response = await axios.post(verifyURL, {
        headers: {
            Accept: "application/json",
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        }
    });

    const json = await response;
    console.log("json", json);
    if (json.status === 200) {
        passport.authenticate("local", {
            // successRedirect:"/dashboard",
            failureRedirect: "/users/login",
            failureFlash: true,
        })(req, res, next)

    } else {
        req.flash("error", "مشکلی در اعتبارسنجی کپچا هست.")
        res.redirect("/users/login")
    }


};

exports.rememberMe = (req, res) => {
    if (req.body.remember) {
        req.session.cookie.originalMaxAge = 24 * 60 * 60 * 1000 //1day  24hours
    } else {
        req.session.cookie.expire = null;
    }
    res.redirect("/dashboard");
}

exports.logout = (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/users/login');
        req.flash("success_msg", "خروج موفقیت آمیز بود.");
    });
};

exports.register = (req, res) => {
    res.render("register", { pageTitle: "ثبت نام کاربر", path: "/register" })
}

exports.createUser = async(req, res) => {
    {
        const errors = [];
        try {
            const { fullname, email, password } = req.body;
            await User.userValidation(req.body);
            const user = await User.findOne({ email })
            if (user) {
                errors.push({ message: "کاربری با این ایمیل وجود دارد." })
                return res.render("register", {
                    pageTitle: "",
                    path: "/register",
                    errors
                })
            }
            const hash = await bcrypt.hash(password, 10);
            await User.create({
                fullname,
                email,
                password: hash
            });
            req.flash("success_msg", "ثبت نام موفقیت آمیز بود.");
            //* another way to save user
            // const user = new User({
            //     fullname,
            //     email,
            //     password
            // })
            // user.save().then((user)=>{
            //     console.log(user)
            // }).catch(err=>{
            //     if(err) throw err
            // })
            res.redirect("/users/login");
        } catch (err) {
            console.log(err)
            err.inner.forEach(e => {
                errors.push({
                    name: e.path,
                    message: e.message
                })
            })
            return res.render("register", {
                pageTitle: "",
                path: "/register",
                errors
            })
        }
    }
}