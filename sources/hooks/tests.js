function* hooks_tests() {
    const e2e = stack.dapis.e2e;
    const action = e2e.cfs;

    let homePageBatch = new E2eFeatureBatch([
        {
            name: "Sign up",
            url: "http://www.facebook.com/",
            delay: 20,
            tests: [
                new E2eTest("Sign up form", action.testForm("reg",  {
                    "firstname": "Cortney",
                    "lastname": "Knorr",
                     "reg_email__": "cortneyknorr@gmail.com",
                    "reg_email_confirmation__": "cortneyknorr@gmail.com",
                    "reg_passwd__": "fang1246",
                    "birthday_month": "Jan",
                    "birthday_day": "17",
                    "birthday_year": "1995",
                    "sex": "2",
                }, "#u_0_e")),
                new E2eTest("Check url", action.waitUntil.title.contains("Forgot Password", 5000)).tag("Url check"),
            ]
        },
        {
            name: "Log in",
            url: "http://www.facebook.com/",
            tests: [
                new E2eTest("Click login", action.clickOn.element("#email")).essential(true),
                new E2eTest("Enter login", action.sendKeys("cortneyknorr@gmail.com")),
                new E2eTest("Click password", action.clickOn.element("#pass")),
                new E2eTest("Enter password", action.sendKeys("fang1246")),
                new E2eTest("Click log in", action.clickOn.element("#u_0_n")),
            ]
        },
    ]);

    yield homePageBatch.testFeature("Sign up");
    // yield homePageBatch.testAllFeatures();
}