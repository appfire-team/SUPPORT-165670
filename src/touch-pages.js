const utils = require("./utils");

const SPACE_KEY = process.env.SPACE_KEY;

async function touchPages(nhEnabledPages) {
    for (let pagedata of nhEnabledPages) {
        //console.log("pagedata before: ", pagedata);
        pagedata.nhconfig.version.number ++;
        //console.log("pagedata after: ", pagedata);
        await utils.updateNhProperty(pagedata.page_id, pagedata.nhconfig);
    }
    console.log("All pages touched successfully");
}

async function doRun(space_key) {
    const nhEnabledPages = await utils.getNhEnabledPages(space_key); //To get all the pages with NH enabled in the space
    await touchPages(nhEnabledPages); // To touch enabled pages for the migrated pages in a space
}

doRun(SPACE_KEY);