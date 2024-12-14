# Define your item pipelines here
#
# Don't forget to add your pipeline to the ITEM_PIPELINES setting
# See: https://docs.scrapy.org/en/latest/topics/item-pipeline.html


# useful for handling different item types with a single interface
from itemadapter import ItemAdapter
from datetime import datetime


class AnimescraperPipeline:
    def process_item(self, item, spider):
        adapter=ItemAdapter(item)
        
        score = adapter.get("score")
        if score is not None:
            adapter["score"]=float(score) 
    

        rank=adapter.get("rank")
        if rank is not None:
            rank_without_tag=rank.replace('#','')
            adapter["rank"]=int(rank_without_tag)


        episodes=adapter.get("episodes")
        if episodes is not None:
            episodes_str=episodes.strip("\n").strip()
            try:
                adapter["episodes"]=int(episodes_str)
            except:
                adapter["episodes"]=episodes_str 
            
    


        elements_str=["status","broadcast","source","duration_per_ep","aired"]
        for element in elements_str:
            value=adapter.get(element)
            if value is not None:
                new_value=value.strip("\n")
                adapter[element]=new_value.strip()


        description=adapter.get("description")
        if description is not None:
            filtered_description=description[:-1]
            adapter["description"]=' '.join([i for i in filtered_description if i!="\r\n"])


        


        # aired=adapter.get("aired")
        # if aired is not None:
        #     aired_list=aired.split(" to ")
        #     start_date=datetime.strptime(aired_list[0], '%b %d, %Y').date()
        #     if len(aired_list) == 2 :
        #         print()
        #         end_date=datetime.strptime(aired_list[1], '%b %d, %Y').date()
        #         adapter["aired"]={'start_date':start_date,'end_date':end_date}
        #     else:
        #         adapter["aired"]={'start_date':start_date}


        

        return item
