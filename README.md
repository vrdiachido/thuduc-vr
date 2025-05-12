CREATE TABLE panorama (
id VARCHAR(255) PRIMARY KEY,
title VARCHAR(255),
preview_image_url VARCHAR(255)
);

CREATE TABLE hotspots (
id SERIAL PRIMARY KEY,
title VARCHAR(255),
description TEXT,
preview_image_url VARCHAR(255),
click_panorama_id VARCHAR(255),
FOREIGN KEY (click_panorama_id) REFERENCES panorama(id)
);
