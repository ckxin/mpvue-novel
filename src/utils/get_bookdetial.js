import cheerio from 'cheerio';
import get_html from './get_html_noloading';
const basic_novel_url = "https://www.2952.cc";
export default async function(book_link) {
    try {
        let html = await get_html(book_link);
        let $ = cheerio.load(html);
        let book_imgsrc = basic_novel_url + $('#fmimg').find('img').attr('src');
        let chapter_list = $('#list').find('li');
        let latest_chapter = $(chapter_list[chapter_list.length-1]).text().split('.')[1];
        let book_author = $($('#info').find('p')[0]).text().split('：')[1];
        let latest_time = $($('#info').find('p')[2]).text().split(" ")[0];
        let book_intro = $('#intro').text();
        return {book_imgsrc, latest_chapter, book_author, latest_time, book_intro};
    } catch(e) {
        alert(e);
    }
}