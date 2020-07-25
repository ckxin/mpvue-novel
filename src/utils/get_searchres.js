import cheerio from 'cheerio';

const basic_novel_url = "https://www.2952.cc";
export default function(html) {
    let $ = cheerio.load(html);
    let title = $('title');
    let search_res = [];
    if(title.text() === "二九小说网") {
        let res_items = $('#nr');
        if(res_items.text() !== "") {
            for(let i=0; i<res_items.length; i++) {
                let item = $(res_items[i]).find('td');
                let book_name = $(item[0]).text();
                let book_link = $(item[0]).find('a').attr('href');
                let latest_chapter = $(item[1]).text();
                let latest_chapter_href = basic_novel_url + '/b' + $(item[1]).find('a').attr('href').split("_").join('/');
                let author = $(item[2]).text();
                let latest_time = new Date(parseInt($(item[4]).text()) * 1000).toLocaleString();
                search_res.push({book_name, book_link, latest_chapter, latest_chapter_href, author, latest_time});
            }
            return {status: true, search_res};
        } else {
            return {status: false}
        }   
    } else {
        let chapter_list = $('#list').find('li');
        let relative_path = $(chapter_list[0]).find('a').attr('href').split('/');
        relative_path = relative_path.slice(0, relative_path.length-1);

        let book_name = $('#info').find('h1').text();
        let book_link = basic_novel_url + relative_path.join('/') + '/index.html';
        let latest_chapter = $(chapter_list[chapter_list.length-1]).text();
        let latest_chapter_href = $(chapter_list[chapter_list.length-1]).find('a').attr('href');
        let author = $($('#info').find('p')[0]).text().split('：')[1];
        let latest_time = $($('#info').find('p')[2]).text();
        search_res.push({book_name, book_link, latest_chapter, latest_chapter_href, author, latest_time})
        return {status: true, search_res};
    }
}