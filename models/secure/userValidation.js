const Yup = require('yup');
exports.schema = Yup.object().shape({
    fullname:Yup.string().required("نام و نام خانوادگی الزامی میباشد.").min(4,"نام و نام خانوادگی نباید کمتر از 4 کاراکتر باشد").max(255,"نام و نام خانوادگی نباید بیشتر از 255 کاراکتر باشد"),
    email:Yup.string().email("فرمت ایمیل صحبح نمیباشد.").required('نوشتن ایمیل الزامی است.'),
    password:Yup.string().min(4,"رمز عبور نباید کمتر از 4 کاراکتر باشد").max(255,"رمز عبور نباید بیشتر از 255 کاراکتر باشد").required("وارد کردن رمز عبور الزامی است."),
    confirmPassword:Yup.string().required("وارد کردن رمز عبور الزامی است.").oneOf([Yup.ref("password"),null],"تکرار کلمه عبور با کلمه عبور باید یکسان باشد.")
})
