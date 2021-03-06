/*
 * Copyright 2019 Zane Littrell
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const webdriver = require("selenium-webdriver"),
  until = webdriver.until,
  By = webdriver.By;
const firefox = require("selenium-webdriver/firefox");
const should = require("chai").should();
const weekDB = require("../db/global.js");
const Login = require("../lib/login.js");

let driver;

describe("InfiniteTimelineWeek", function() {
  beforeEach(function() {
    driver = new webdriver.Builder()
      .forBrowser("firefox")
      .setFirefoxOptions(new firefox.Options().headless())
      .build();
  });
  afterEach(async function() {
    this.timeout(0);
    await driver.quit();
  });
  it("should give the current week", async function() {
    this.timeout(0);
    try {
      await Login.login(driver);
      await weekDB.put();
      await driver.get("http://localhost:3000/infinite_timeline/week");

      const week = await driver
        .findElement(By.id("week"))
        .getAttribute("value");

      week.should.equal("" + weekDB.value);

      await weekDB.delete();
      await Login.logout(driver);
    } catch (error) {
      console.error("Error: " + error);
      throw error;
    }
  });
  it("should set the current week", async function() {
    this.timeout(0);
    try {
      await Login.login(driver);
      await weekDB.put();
      await driver.get("http://localhost:3000/infinite_timeline/week");

      const weekEl = await driver.findElement(By.id("week"));
      await weekEl.clear();
      await weekEl.sendKeys("2");
      await driver.findElement(By.id("form-submit")).click();

      await driver.wait(until.urlIs("http://localhost:3000/infinite_timeline"));

      const week = await weekDB.get("TimelineWeek");
      week.Item.value.should.equal(2);
      await weekDB.delete();
      await Login.logout(driver);
    } catch (error) {
      console.error("Error: " + error);
      throw error;
    }
  });
});
