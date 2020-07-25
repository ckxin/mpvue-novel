import cheerio from 'cheerio';
import get_html from './get_html';

const basic_novel_url = "https://www.2952.cc";

export default async function() {
    let html = await get_html(basic_novel_url);
    let $ = cheerio.load(html);
    let hot_contents = [];
    let hot_content_boxs = $('.item', '#hotcontent');
    for(let i=0; i<hot_content_boxs.length; i++) {
        let img_src = $(hot_content_boxs[i]).find('.image').find('img').attr('src');
        let book_link = $(hot_content_boxs[i]).find('.image').find('a').attr('href');
        let author = $(hot_content_boxs[i]).find('dl').find('dt').find('span').text();
        let book_name = $(hot_content_boxs[i]).find('dl').find('dt').find('a').text();
        let intro = $(hot_content_boxs[i]).find('dl').find('dd').text().split('　').join('');
        if(intro.length >= 65) {
          intro = intro.substr(0, 65)+"...";
        }
        hot_contents.push({img_src, book_link, author, book_name, intro});
    }
    let type_contents = [];
    let type_contents_boxs = $(".content");
    for(let i=0; i<type_contents_boxs.length; i++) {
        let type_name = $(type_contents_boxs[i]).find('h2').text();
        let first_book_imgsrc = $(type_contents_boxs[i]).find('img').attr('src');
        let first_book_name = $(type_contents_boxs[i]).find('dt').text();
        let first_book_link = $(type_contents_boxs[i]).find('dt').find('a').attr('href');
        let first_book_intro = $(type_contents_boxs[i]).find('dd').text().split('　').join('');
        if(first_book_intro.length >= 65) {
          first_book_intro = first_book_intro.substr(0, 65) + "...";
        }
        let first_book_info = {first_book_imgsrc, first_book_name, first_book_link, first_book_intro};
        let other_books_info = [];
        let other_books_list = $(type_contents_boxs[i]).find('li');
        for(let j=0; j<other_books_list.length; j++) {
            let other_book_name = $(other_books_list[j]).find('a').text();
            let other_book_link = $(other_books_list[j]).find('a').attr('href');
            let other_book_author = $(other_books_list[j]).text().split('/')[1];
            other_books_info.push({other_book_name, other_book_link, other_book_author});
        }
        type_contents.push({type_name, first_book_info, other_books_info: other_books_info.slice(0, 5)});
    }
    return {hot_contents, type_contents}
}