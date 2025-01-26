import scrapy
from animescraper.items import AnimeItem
from itertools import chain

class AnimespiderSpider(scrapy.Spider):
    name = "animespider"
    allowed_domains = ["myanimelist.net"]
    start_urls = ["https://myanimelist.net/topanime.php"]
    start_urls = ["https://myanimelist.net/topanime.php?limit=500"]

    def parse(self, response):
        animes=response.css("tr.ranking-list")
        for anime in animes:
            url=anime.css("a.hoverinfo_trigger").attrib['href']
            yield response.follow(url,callback=self.parse_anime_page)

        next_page=response.css("a.link-blue-box.next").attrib["href"]
        if next_page is not None  :
            if "1000" in next_page:
                pass
            else:
                next_url="https://myanimelist.net/topanime.php"+next_page
                yield response.follow(next_url,callback=self.parse)


    def parse_anime_page(self, response):
        leftside=response.css("div.leftside")

        anime_infos=response.css("div.leftside div.spaceit_pad")
        # characters_name=response.css("h3.h3_characters_voice_actors a::text").getall()
        # characters_img= response.css("div.picSurround a.fw-n img::attr(data-src)").getall()[:10]

        characters_list=response.css("div.detail-characters-list")[0]
        left_column=characters_list.css("div.left-column > table ")
        right_column=characters_list.css("div.left-right > table ")

        anime=AnimeItem()
        

        anime["title"] = response.css("h1.title-name strong::text").get()
        anime["eng_title"] = response.css("p.title-english::text").get()
        anime["anime_img"] = leftside.css("div a img.lazyload").attrib.get('data-src')
        anime["score"] = response.css("div.score-label::text").get()
        anime["rank"] = response.css("span.ranked strong::text").get()
        anime["description"] = response.xpath('//p[@itemprop="description"]/text()').getall()
        for info in anime_infos:
            element=info.css("span.dark_text::text").get()
            # print("===================================")
            # print(element)
            if element == "Episodes:" :
                anime["episodes"] = info.css("::text").getall()[2]
            elif element == "Status:" :
                anime["status"] = info.css("::text").getall()[2]
            elif element == "Aired:" :
                anime["aired"] = info.css("::text").getall()[2]
            elif element == "Premiered:" :
                anime["premiered"] = info.css("a::text").get()
            elif element == "Broadcast:":
                anime["broadcast"] = info.css("::text").getall()[2]
            elif element == "Licensors:" :
                anime["licensors"] = info.css("a::text").get()
            elif element == "Studios:" :
                anime["studios"] = info.css("a::text").get()
            elif element == "Source:" :
                anime["source"] = info.css("a::text").get()
            elif element == "Genres:" :
                anime["genres"] = info.css("a::text").getall()
            elif element == "Demographic:" :
                anime["demographic"] = info.css("a::text").get()
            elif element == "Duration:" :
                anime["duration_per_ep"] = info.css("::text").getall()[2]
        # anime["characters"] = [{"character_name": characters_name[i], "character_img": characters_img[i]} for i in range(len(characters_name))]
        # anime["characters"].append

        anime["characters"]=[] 
        for item in chain(left_column,right_column) :
            images=item.css("img::attr(data-src)").getall()
            anime["characters"].append({
                
                "character_img":images[0] if len(images) > 0 else None,
                "character_name":item.css("h3.h3_characters_voice_actors a::text").get(),
                "character_role":item.css("div.spaceit_pad small::text").get(),
                "voice_actor_name":item.css("td.va-t a::text").get(),
                "voice_actor_nationality":item.css("td.va-t small::text").get(),
                "voice_actor_img":images[1] if len(images) > 1 else None
            })
           

        yield anime

       
   