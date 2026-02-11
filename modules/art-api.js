export async function fetchArt() {
    // A curated list of masterpieces hosted on Wikimedia (Reliable & Fast)
    const collection = [
        {
            title: "The Starry Night",
            artist: "Vincent van Gogh (1889)",
            image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg"
        },
        {
            title: "The Great Wave off Kanagawa",
            artist: "Hokusai (1831)",
            image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Great_Wave_off_Kanagawa2.jpg/1280px-Great_Wave_off_Kanagawa2.jpg"
        },
        {
            title: "Wanderer above the Sea of Fog",
            artist: "Caspar David Friedrich (1818)",
            image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Caspar_David_Friedrich_-_Wanderer_above_the_Sea_of_Fog_-_Google_Art_Project.jpg/1280px-Caspar_David_Friedrich_-_Wanderer_above_the_Sea_of_Fog_-_Google_Art_Project.jpg"
        },
        {
            title: "Girl with a Pearl Earring",
            artist: "Johannes Vermeer (1665)",
            image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/1280px-1665_Girl_with_a_Pearl_Earring.jpg"
        },
        {
            title: "The School of Athens",
            artist: "Raphael (1511)",
            image: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/%22The_School_of_Athens%22_by_Raffaello_Sanzio_da_Urbino.jpg/1280px-%22The_School_of_Athens%22_by_Raffaello_Sanzio_da_Urbino.jpg"
        },
        {
            title: "Nighthawks",
            artist: "Edward Hopper (1942)",
            image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Nighthawks_by_Edward_Hopper_1942.jpg/1280px-Nighthawks_by_Edward_Hopper_1942.jpg"
        },
        {
            title: "Liberty Leading the People",
            artist: "Eugène Delacroix (1830)",
            image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5d/Eug%C3%A8ne_Delacroix_-_Le_28_Juillet._La_Libert%C3%A9_guidant_le_peuple.jpg/1280px-Eug%C3%A8ne_Delacroix_-_Le_28_Juillet._La_Libert%C3%A9_guidant_le_peuple.jpg"
        },
        {
            title: "The Birth of Venus",
            artist: "Sandro Botticelli (1486)",
            image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg/1280px-Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg"
        },
        {
            title: "A Sunday on La Grande Jatte",
            artist: "Georges Seurat (1884)",
            image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/A_Sunday_on_La_Grande_Jatte%2C_Georges_Seurat%2C_1884.jpg/1280px-A_Sunday_on_La_Grande_Jatte%2C_Georges_Seurat%2C_1884.jpg"
        },
        {
            title: "Cafe Terrace at Night",
            artist: "Vincent van Gogh (1888)",
            image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Van_Gogh_-_Terrasse_des_Caf%C3%A9s_an_der_Place_du_Forum_in_Arles_am_Abend1.jpeg/1280px-Van_Gogh_-_Terrasse_des_Caf%C3%A9s_an_der_Place_du_Forum_in_Arles_am_Abend1.jpeg"
        }
    ];

    // Pick a random one from the list
    const randomArt = collection[Math.floor(Math.random() * collection.length)];

    // Simulate an async delay so it feels like an API
    return new Promise(resolve => {
        setTimeout(() => resolve(randomArt), 100);
    });
}