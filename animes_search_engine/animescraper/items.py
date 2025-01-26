# Define here the models for your scraped items
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/items.html

import scrapy


class AnimescraperItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    pass

class AnimeItem(scrapy.Item):
    title=scrapy.Field()
    eng_title=scrapy.Field()
    anime_img=scrapy.Field()
    score=scrapy.Field()
    rank=scrapy.Field()
    description=scrapy.Field()
    episodes=scrapy.Field()
    status=scrapy.Field()
    aired=scrapy.Field()
    premiered=scrapy.Field()
    broadcast=scrapy.Field()
    licensors=scrapy.Field()
    studios=scrapy.Field()
    source=scrapy.Field()
    genres=scrapy.Field()
    demographic=scrapy.Field()
    duration_per_ep=scrapy.Field()
    characters=scrapy.Field()


class AnimeCharacter(scrapy.Item):
    character_name=scrapy.Field()
    character_img=scrapy.Field()