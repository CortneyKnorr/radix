function* hooks_tests() {
    const e2e = stack.dapis.e2e;
    const action = e2e.cfs;

    let homePageTests = new E2eFeatureBatch([
        {
            name: "Sign up",
            url: "http://www.facebook.com/",
            delay: 20,
            tests: [
                new E2eTest("Click on inexistant", action.clickOn.element("#u_0_3asda")).invert(true).tag("example"),
                new E2eTest("Click first name", action.clickOn.element("#u_0_1")),
                new E2eTest("Enter first name", action.sendKeys("Cortney")),
                new E2eTest("Click last name", action.clickOn.element("#u_0_3")).linked(true).dependsOf("example"),
                new E2eTest("Enter last name", action.sendKeys("Jordan")),
                new E2eTest("Click mail", action.clickOn.element("#u_0_5")),
                new E2eTest("Enter email", action.sendKeys("cortneyknorr@gmail.com")),
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
                new E2eTest("Click log in", action.clickOn.element("#u_0_p")),
            ]
        },
    ]);

    yield homePageTests.testFeature("Sign up");
}