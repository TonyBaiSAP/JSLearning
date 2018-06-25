/* feedreader.js
 *
 * This is the spec file that Jasmine will read and contains
 * all of the tests that will be run against your application.
 */

/* We're placing all of our tests within the $() function,
 * since some of these tests may require DOM elements. We want
 * to ensure they don't run until the DOM is ready.
 */
$(function() {
    /* This is our first test suite - a test suite just contains
     * a related set of tests. This suite is all about the RSS
     * feeds definitions, the allFeeds variable in our application.
     */
    describe('RSS Feeds', function() {
        /* This is our first test - it tests to make sure that the
         * allFeeds variable has been defined and that it is not
         * empty. Experiment with this before you get started on
         * the rest of this project. What happens when you change
         * allFeeds in app.js to be an empty array and refresh the
         * page?
         */
        it('are defined', function() {
            expect(allFeeds).toBeDefined();
            expect(allFeeds.length).not.toBe(0);
        });


        /* TODO: Write a test that loops through each feed
         * in the allFeeds object and ensures it has a URL defined
         * and that the URL is not empty.
         */
        it('all feeds URL are defined', function() {
            allFeeds.forEach(function(oFeed) {
                expect(oFeed.url).toMatch(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/);
            });
        });

        it('the new feed URL not matched', function() {
            var oDummy = {
                name: 'Dummy error test',
                url: 'http//:dummy.com'
            }
            allFeeds.push(oDummy);
            expect(function() {
                let expression = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
                let regex = new RegExp(expression);
                if (!allFeeds[4].url.match(regex)) {
                    throw new Error("Not match");
                }
            }).toThrow(new Error("Not match"));
            allFeeds.splice(4, 1);
        });

        /* TODO: Write a test that loops through each feed
         * in the allFeeds object and ensures it has a name defined
         * and that the name is not empty.
         */
        it("have names", function() {
            allFeeds.forEach(function(feed) {
                expect(feed.name).toBeDefined();
                expect(typeof feed.name).toBe("string");
                expect(feed.name.length).not.toBe(0);
            });
        });

    });


    /* TODO: Write a new test suite named "The menu" */

    describe("The menu", function() {

        // Pre-define elements needed for testing hiding/showing of the menu
        var menuIcon = document.querySelector(".menu-icon-link");

        /* TODO: Write a test that ensures the menu element is
         * hidden by default. You'll have to analyze the HTML and
         * the CSS to determine how we're performing the
         * hiding/showing of the menu element.
         */
        it("body has 'menu-hidden' initially", function() {
            expect($("body").hasClass("menu-hidden")).toBe(true);
        });

        /* TODO: Write a test that ensures the menu changes
         * visibility when the menu icon is clicked. This test
         * should have two expectations: does the menu display when
         * clicked and does it hide when clicked again.
         */
        it("body toggles the class 'menu-hidden' on clicking menu icon", function() {
            menuIcon.click();
            expect($("body").hasClass("menu-hidden")).toBe(false);

            menuIcon.click();
            expect($("body").hasClass("menu-hidden")).toBe(true);
        });
    });





    /* TODO: Write a new test suite named "Initial Entries" */
    // Testing suite of Initial Entries
    describe("Initial Entries", function() {

        // Avoid duplicated setup
        // Before loading feed
        beforeEach(function(done) {
            loadFeed(0, done);
        });

        /* TODO: Write a test that ensures when the loadFeed
         * function is called and completes its work, there is at least
         * a single .entry element within the .feed container.
         * Remember, loadFeed() is asynchronous so this test will require
         * the use of Jasmine's beforeEach and asynchronous done() function.
         */

        it("has at least 1 entry after loadFeed function is called", function() {
            expect($('.feed .entry').length).toBeGreaterThan(0);
        });

        // Make sure each (.feed .entry-link) element has valid link
        it("has a entry that has a link starting with 'http(s)://'", function(done) {
            var entries = document.querySelector(".feed").getElementsByClassName("entry-link");
            for (var i = 0; i < entries.length; i++) {
                expect(entries[i].href).toMatch(/^(http|https):\/\//);
            }
            done();
        });
    });

    /* TODO: Write a new test suite named "New Feed Selection" */
    describe("New Feed Selection", function() {

        // Avoid duplicated setup
        // Initial loaded feed setup
        var initFeedSelection;
        beforeEach(function(done) {
            loadFeed(0, function() {
                initFeedSelection = document.querySelector(".feed").innerHTML;

                loadFeed(1, done);
            });
        });

        /* TODO: Write a test that ensures when a new feed is loaded
         * by the loadFeed function that the content actually changes.
         * Remember, loadFeed() is asynchronous.
         */
        it("changes its loaded content", function() {
            var newFeedSelection = document.querySelector(".feed").innerHTML;
            expect(initFeedSelection).not.toBe(newFeedSelection);
        });
    });

}());