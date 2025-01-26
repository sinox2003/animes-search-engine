import pdfkit
import jinja2
import json
import os

# Load anime list from JSON file
with open('animes_search_engine\\animescraper\\spiders\\animeList.json', 'r', encoding='utf-8') as f:
    animes = json.load(f)


# Configure wkhtmltopdf
wkhtmltopdf_path = "C:\\Program Files\\wkhtmltopdf\\bin\\wkhtmltopdf.exe"
config = pdfkit.configuration(wkhtmltopdf=wkhtmltopdf_path)

# Setup Jinja2 environment
template_loader = jinja2.FileSystemLoader('C:\\Users\\menno\\Desktop\\AI-location\\animes_search_engine\\pdf_transformer')
template_env = jinja2.Environment(loader=template_loader)
print(os.getcwd())
template = template_env.get_template("anime_template.html")

# Ensure the output directory exists
output_dir = "C:\\Users\\menno\\Desktop\\AI-location\\animes_search_engine\\pdf_transformer\\pdfs"
os.makedirs(output_dir, exist_ok=True)


for index,anime in enumerate(animes):
    anime["description"] = anime["description"].split('\r\n')

  
    div_nb = int(len(anime["characters"]) / 2)
    anime.update({
        "characters_1": anime["characters"][:div_nb],
        "characters_2": anime["characters"][div_nb:]
    })

    
    output_text = template.render(anime)

    pdf_filename = f"{output_dir}/anime{index + 1}.pdf"

    try:
        pdfkit.from_string(output_text, pdf_filename, configuration=config)
        print(f"PDF generated: {pdf_filename}")
    except Exception as e:
        print(f"Failed to generate PDF for {anime['title']}: {e}")

        







