const songCards = (songName, singer, img) => {
    return (
        /*html*/`
    <style>
        .song-card {
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 200px;
            height: 300px;
            padding: 1rem;
            background-color: #f9f9f9;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s;
            overflow: hidden;
        }

        .song-card img {
            width: 100%;
            height: 150px;
            object-fit: cover;
            border-radius: 10px;
        }

        .song-card h3 {
            margin: 1rem 0 0.5rem;
            font-size: 1.2rem;
            color: #333;
            text-align: center;
            width: 100%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .song-card p {
            margin: 0;
            font-size: 1rem;
            color: #666;
            text-align: center;
            width: 100%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .song-card:hover {
            transform: translateY(-5px);
        }

        @media (max-width: 600px) {
            .song-card {
                width: 150px;
                height: 250px;
            }

            .song-card h3 {
                font-size: 1rem;
            }

            .song-card p {
                font-size: 0.9rem;
            }

            .song-card img {
                height: 120px;
            }
        }
    </style>

    <div class="song-card">
        <img src="${img}" alt="${songName}">
        <h3>${songName}</h3>
        <p>${singer}</p>
    </div>
    `
    );
}

export default songCards;
