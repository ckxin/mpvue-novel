import get_html from './get_html';
import cheerio from 'cheerio';

export default async function(url) {
    let html = await get_html(url);
    let $ = cheerio.load(html);
    let rank_box = $('.b4')[1];
    let rank_list_li = $(rank_box).find('li');
    let rank_list = [];
    for(let i=0; i<rank_list_li.length; i++) {
        let book_name = $(rank_list_li[i]).find('a').text();
        let book_link = $(rank_list_li[i]).find('a').attr('href');
        rank_list.push({book_name, book_link});
    }
    if(url.includes("allvote")) {
        rank_list = rank_list.slice(1, 21);
    } else {
        rank_list = rank_list.slice(0, 20);
    }
    return rank_list;
}