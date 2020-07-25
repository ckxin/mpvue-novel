import get_html from './get_html_noloading';
import cheerio from 'cheerio';

const basic_novel_url = "https://www.2952.cc";

export async function bookread(url, get_index) {
    try {
        let html = await get_html(url);
        let $ = cheerio.load(html);
        let list_li = $('#list').find('li');
        let title_list = [];
        for(let i=0; i<list_li.length; i++) {
            let chapter_name = $(list_li[i]).text().split('.')[1];
            let chapter_link = basic_novel_url + $(list_li[i]).find('a').attr('href');
            title_list.push({title_id: 'title_'+i, chapter_name, chapter_link});
        }
        let current_chapters = [];
        for(let i=get_index-1; i<get_index+1; i++) {
            let content_html = await get_html(title_list[i].chapter_link);
            let $$ = cheerio.load(content_html, {decodeEntities: false});
            let chapter_title = $$('.bookname').find('h1').text();
            let content_box = $$('#content');
            let chapter_content = content_box.html().split('<br><br>');
            current_chapters.push({chapter_id: 'chapter_'+i, chapter_title, chapter_content});
        }
        return {title_list, current_chapters};  
    } catch(err) {
        console.log("bookread error:");
        console.log(err);
    }   
}

export async function getchapter(get_index, get_url) {
    try {
        let html = await get_html(get_url);
        let $ = cheerio.load(html, {decodeEntities: false});
        let chapter_title = $('.bookname').find('h1').text();
        let content_box = $('#content');
        let chapter_content = content_box.html().split('<br><br>');
        return {chapter_id: 'chapter_'+get_index, chapter_title, chapter_content};
    } catch(err) {
        console.log("getchapter error:");
        console.log(err);
    }   
}