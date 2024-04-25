const utils = require("./utils");

const SPACE_KEY = process.env.SPACE_KEY;

async function findErrorPages(nhEnabledPages) {
    let errorPages = [];
    for (let pagedata of nhEnabledPages) {
        let promiseArray = [utils.getNhStateProperty(pagedata.page_id), utils.getPageData(pagedata.page_id)];
        const response = await Promise.all(promiseArray);
        //console.log("response: ", response[0], response[1]);
        if (response[1].version.number < response[0].nhconfig.value['page-version'].number) {
            errorPages.push({page_id: response[1].id, page_url: response[1]._links.base + response[1]._links.webui});
        }
    }
    return errorPages;
}

async function doRun(space_key='') {

    const spaces = await utils.getSpaces(); //To get all the spaces in the instance
    console.log('spaces#:', spaces.length);
    for (let space of spaces) {
        const nhEnabledPages = await utils.getNhEnabledPages(space.id); //To get all the pages with NH enabled in the space
        const nhFailedPages = await findErrorPages(nhEnabledPages); //To get all the pages with NH enabled in the space
        if (nhFailedPages.length > 0) {
            console.log(`space: ${space.key}, error pages#: ${nhFailedPages.length}`);
            console.log("nhFailedPages: ", nhFailedPages);
        } else {
            console.log("No pages found with error for space: ", space.key);
        }
    }
}

doRun();