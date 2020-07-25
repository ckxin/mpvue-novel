import get_html from './get_html';
import cheerio from 'cheerio';

export default async function(url) {
    let html = await get_html(url);
    let $ = cheerio.load(html);
    let hot_box = $('#hotcontent').find('.item');
    let hot_contents = [];
    for(let i=0; i<hot_box.length; i++) {
        let book_imgsrc = $(hot_box[i]).find('img').attr('src');
        let book_name = $(hot_box[i]).find('dt').find('a').text();
        let book_link = $(hot_box[i]).find('dt').find('a').attr('href');
        let book_author = $(hot_box[i]).find('span').text();
        hot_contents.push({book_imgsrc, book_name, book_link, book_author});
    }
    let endbook_list_li = $('.l').find('li');
    let endbook_list = [];
    for(let i=0; i<endbook_list_li.length; i++) {
        let book_name = $($(endbook_list_li[i]).find('a')[0]).text();
        let book_link = $($(endbook_list_li[i]).find('a')[0]).attr('href');
        let latest_chapter = $($(endbook_list_li[i]).find('a')[1]).text();
        let book_author = $(endbook_list_li[i]).find('.s5').text();
        endbook_list.push({book_name, book_link, latest_chapter, book_author});
    }
    let list_page_num = parseInt($('#pagestats').text().split('/')[1]);
    let basic_endurl = $('.first').attr('href').split('page=')[0]+"page=";
    return {hot_contents, endbook_list, list_page_num, basic_endurl};
}