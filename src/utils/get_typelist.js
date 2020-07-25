import get_html from './get_html';
import cheerio from 'cheerio';

export default async function(url) {
    let html = await get_html(url);
    let $ = cheerio.load(html);
    let type_list_li = $('.l').find('li');
    let type_list = [];
    for(let i=0; i<type_list_li.length; i++) {
        let book_name = $($(type_list_li[i]).find('a')[0]).text();
        let book_link = $($(type_list_li[i]).find('a')[0]).attr('href');
        let latest_chapter = $($(type_list_li[i]).find('a')[1]).text();
        let book_author = $(type_list_li[i]).find('.s5').text();
        type_list.push({book_name, book_link, latest_chapter, book_author});
    }
    let list_page_num = parseInt($('#pagestats').text().split('/')[1]);
    let basic_typeurl = $('.first').attr('href').split('-')[0]+"-";
    return {type_list, list_page_num, basic_typeurl};
}