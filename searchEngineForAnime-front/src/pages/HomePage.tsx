import image1 from "../assets/images/image1.jpg";
import image2 from "../assets/images/image2.jpg";
import image3 from "../assets/images/image3.jpg";
import image4 from "../assets/images/image4.jpg";
import image5 from "../assets/images/image5.jpg";
import image6 from "../assets/images/image6.jpg";
import image7 from "../assets/images/image7.jpg";
import image8 from "../assets/images/image8.jpg";
import image9 from "../assets/images/image9.jpg";
import image10 from "../assets/images/image10.jpg";


import TopAnimeSection from '../components/TopAnimeSection';
import SearchBar from '../components/SearchBar'


const HomePage = () => {
    const images = [image1, image2, image3, image4, image5, image6, image7, image8 , image9, image10];

  return (
    <div className="min-h-screen  text-white">
      <div className='h-16'></div>
      {/* Hero Section with Scrolling Images */}
      <div style={{zoom:1.23}} className="relative  h-[calc(100vh-64px)] overflow-hidden">
        <div  className="absolute inset-0 flex animate-infinite-scroll  h-full w-full">
          {images.map((image, index) => (
            <img

              key={index}
              src={image}
              alt={`Anime ${index + 1}`}
              className="h-full w-full object-cover"
            />
          ))}
        </div>

        {/* Overlay on Images */}
        <div style={{zoom:0.83}} className="absolute inset-0 bg-black bg-opacity-70">
          <div className="container mx-auto h-full flex flex-col justify-center items-center px-4">
            <h1 className="text-2xl font-bold text-center">
              Discover Your Next Anime
            </h1>

            {/* Search Bar */}
            <div id="searchBar" className="container mx-auto py-10 px-4">
              <SearchBar />
              </div>
          </div>
        </div>
      </div>

      {/*/!* Discover Section *!/*/}
      {/*<div id="discover" className="container mx-auto py-16 px-4 ">*/}
      {/*  <h2 className="text-3xl font-semibold">Discover Your Next Anime</h2>*/}
      {/*  <p className="text-gray-400">Explore a selection of popular and recommended anime.</p>*/}
      {/*  <DiscoverSection />*/}
      {/*</div>*/}

      {/*/!* Categories Section *!/*/}
      {/*<div id="categories" className="container mx-auto py-16 px-4">*/}
      {/*  <h2 className="text-3xl font-semibold">Categories</h2>*/}
      {/*  <p className="text-gray-400">Browse through various anime categories.</p>*/}
      {/*  <CategoriesSection />*/}
      {/*</div>*/}

      {/* Top Anime Section */}
        <TopAnimeSection />


    </div>
  );
};

export default HomePage;
