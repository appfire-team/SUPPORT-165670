const utils = require("./utils");

const SPACE_KEY = process.env.SPACE_KEY;

async function touchPages(nhEnabledPages, space_key) {
    for (let pagedata of nhEnabledPages) {
        //console.log("pagedata before: ", pagedata);
        pagedata.nhconfig.version.number ++;
        //console.log("pagedata after: ", pagedata);
        await utils.updateNhProperty(pagedata.page_id, pagedata.nhconfig);
    }
    console.log("All pages touched successfully for space: ", space_key);
}

async function doRun(space_key='') {
    const spaces = await utils.getSpaces(); //To get all the spaces in the instance
    console.log('spaces#:', spaces.length);
    for (let space of spaces) {
        const nhEnabledPages = await utils.getNhEnabledPages(space.id); //To get all the pages with NH enabled in the space
        await touchPages(nhEnabledPages, space.key); // To touch enabled pages for the migrated pages in a space
    }
}

doRun();