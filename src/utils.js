const axios = require("axios");

const API_KEY = process.env.API_KEY;
const BASE_URL = process.env.BASE_URL;
const NH_KEY = "nl_avisi_nh";
const NH_STATE_KEY = "nl_avisi_nh_state";

async function getSpaceId(space_key) { 
    const URL = `${BASE_URL}/api/v2/spaces?keys=${space_key}`;
    const spaces = await axios.get(URL, {headers: {Authorization: `Basic ${API_KEY}`}});
    if (spaces.data.results.length === 0) {
        throw new Error("Provided space not found");
    }
    const space_id = spaces.data.results[0].id;
    console.log("space_id: ", space_id);
    return space_id;
}

async function getAllPagesInSpace(spaceId, childPages, urlParams = 'limit=250') {
    const URL = `${BASE_URL}/api/v2/pages?space-id=${spaceId}&${urlParams}`;
	let asyncResp = await axios.get(URL, {headers: {Authorization: `Basic ${API_KEY}`}});
	for (let pageObj of asyncResp.data.results) {
		childPages.push(pageObj)
	}
	if (asyncResp.data._links.next && asyncResp.data._links.next != '') {
		const urlParams = asyncResp.data._links.next.split('?')[1]
		await getAllPagesInSpace(spaceId, childPages, urlParams)
	}
	return asyncResp.data.results
}

async function getPagesInSpace(space_key) {
    const space_id = await getSpaceId(space_key);
    let pagearray = [];
    await getAllPagesInSpace(space_id, pagearray);
    //console.log("pages: ", pagearray);
    if (pagearray.length === 0) {
        throw new Error("No pages found in the provided space");
    }
    return pagearray;
}

async function getNhProperty(page_id, property_key) {
    const URL = `${BASE_URL}/api/v2/pages/${page_id}/properties?key=${property_key}`;
    const response = await axios.get(URL, {headers  : {Authorization: `Basic ${API_KEY}`}});
    return {page_id, nhconfig: response.data.results[0]};
}

async function getNhEnabledPages(SPACE_KEY) {
    const pages = await getPagesInSpace(SPACE_KEY);
    let promiseArray = [];
    for (let page of pages) {
        promiseArray.push(getNhProperty(page.id, NH_KEY));
    }
    let enabledPages = await Promise.all(promiseArray);

    let nhEnabledPages = enabledPages.filter(page => page.nhconfig && page.nhconfig.value.isEnabled === true);
    //console.log("nhEnabledPages: ", nhEnabledPages);
    return nhEnabledPages;
}

async function updateNhProperty(page_id, nhconfig) {
    const URL = `${BASE_URL}/api/v2/pages/${page_id}/properties/${nhconfig.id}`;
    try {
        await axios.put(URL, nhconfig, {headers: {Authorization: `Basic ${API_KEY}`}});
    } catch (error) {
        console.log("Error updating NH property: ", error);
    }
}

async function getNhStateProperty(page_id) {
    const nh_state_obj = await getNhProperty(page_id, NH_STATE_KEY);
    return nh_state_obj;
}

async function getPageData(page_id) {
    const URL = `${BASE_URL}/api/v2/pages/${page_id}`;
    const response = await axios.get(URL, {headers: {Authorization: `Basic ${API_KEY}`}});
    return response.data;
}

module.exports = {
    getSpaceId,
    getPagesInSpace,
    getNhProperty,
    getNhEnabledPages,
    updateNhProperty,
    getNhStateProperty,
    getPageData
}