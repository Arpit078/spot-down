-- Creating song hash table :
    CREATE TABLE songs (
        track_id VARCHAR(100) PRIMARY KEY,
        track_name VARCHAR(255),
        track_artist VARCHAR(255),
        track_cover VARCHAR(255)
    );