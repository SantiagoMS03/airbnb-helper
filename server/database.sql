DROP TABLE IF EXISTS Property CASCADE;
DROP TABLE IF EXISTS Booking CASCADE;
DROP TABLE IF EXISTS CleaningCompany CASCADE;

-- Create CleaningCompany Table
CREATE TABLE IF NOT EXISTS CleaningCompany (
    cleaning_company_id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    password VARCHAR(255)
);

-- Create Property Table
CREATE TABLE IF NOT EXISTS Property (
    property_id SERIAL PRIMARY KEY,
    address VARCHAR(255) NOT NULL,
    bedrooms INT NOT NULL,
    property_type VARCHAR(50) NOT NULL,
    cleaning_company_id INT NOT NULL,
    FOREIGN KEY (cleaning_company_id) REFERENCES CleaningCompany(cleaning_company_id)
);

-- Create the Booking table
CREATE TABLE IF NOT EXISTS Booking (
    booking_id SERIAL PRIMARY KEY,
    property_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    guest_number INT NOT NULL,
    confirmation_code VARCHAR(48) NOT NULL UNIQUE,
    turn_off_pool BOOLEAN DEFAULT FALSE,
    clean_grill BOOLEAN DEFAULT FALSE,
    clean_pet_fur BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (property_id) REFERENCES Property(property_id)
);

-- Insert Cleaning Companies
INSERT INTO CleaningCompany (company_name) VALUES 
('Escorcio Cleaning'),
('Kaizen Cleaning'),
('Solutions VP'),
('Spacca Cleaning'),
('Mello Cleaning'),
('Techno Cleaning'),
('TJMM Cleaning'),
('VKL Cleaning'),
('Zero Km Cleaning'),
('Zenith Cleaning');

-- Insert Properties for Escorcio Cleaning (cleaning_company_id = 1)
INSERT INTO Property (address, bedrooms, property_type, cleaning_company_id) VALUES
('2723 Coupe St', 4, 'House', 1);

-- Insert Properties for Kaizen Cleaning (cleaning_company_id = 2)
INSERT INTO Property (address, bedrooms, property_type, cleaning_company_id) VALUES
('#1-606 Blue Heron', 1, 'Condo', 2),
('#2-1402 Blue Heron', 1, 'Condo', 2),
('1706 Enclave', 2, 'Condo', 2),
('1604 Enclave', 2, 'Condo', 2);

-- Insert Properties for Solutions VP (cleaning_company_id = 3)
INSERT INTO Property (address, bedrooms, property_type, cleaning_company_id) VALUES
('5710 Olga St', 3, 'House', 3),
('2731 Corvette Ln', 3, 'House', 3),
('2772 Corvette Ln', 4, 'House', 3),
('2775 Corvette Ln', 4, 'House', 3),
('2780 Corvette Ln', 4, 'House', 3),
('5763 T Bird Ln', 3, 'House', 3),
('2750 Corvette Ln', 4, 'House', 3),
('2613 Roadster Ln', 3, 'House', 3),
('2647 Roadster Ln', 3, 'House', 3),
('5743 Lesabre Dr', 3, 'House', 3);

-- Insert Properties for Spacca Cleaning (cleaning_company_id = 4)
INSERT INTO Property (address, bedrooms, property_type, cleaning_company_id) VALUES
('925 Seasons Blvd', 5, 'House', 4),
('8679 La Isla Dr', 4, 'House', 4);

-- Insert Properties for Mello Cleaning (cleaning_company_id = 5)
INSERT INTO Property (address, bedrooms, property_type, cleaning_company_id) VALUES
('8471 Secret Key Cv', 5, 'House', 5),
('2771 Lido Key Dr', 5, 'House', 5),
('5744 Delorean Dr', 4, 'House', 5),
('2710 Coupe St', 3, 'House', 5),
('2639 Corvette Ln', 3, 'House', 5),
('1902 Enclave', 2, 'Condo', 5),
('2608 Enclave', 0, 'Studio', 5),
('2219 Crofton Springs', 8, 'House', 5),
('1225 Challenge Drive', 9, 'House', 5),
('213 Tangelo Ave', 5, 'House', 5);

-- Insert Properties for Techno Cleaning (cleaning_company_id = 6)
INSERT INTO Property (address, bedrooms, property_type, cleaning_company_id) VALUES
('5700 Delorean Dr', 4, 'House', 6),
('2725 Corvette Ln', 3, 'House', 6),
('2718 Corvette Ln', 3, 'House', 6),
('2659 Triumph Way', 3, 'House', 6),
('2662 Corvette Ln', 2, 'House', 6);

-- Insert Properties for TJMM Cleaning (cleaning_company_id = 7)
INSERT INTO Property (address, bedrooms, property_type, cleaning_company_id) VALUES
('8806 Geneve Ct', 5, 'House', 7),
('1744 Lima Ave', 7, 'House', 7),
('5708 Delorean Dr', 4, 'House', 7),
('2700 Camaro Dr', 4, 'House', 7),
('WP203 2307SPD', 3, 'House', 7);

-- Insert Properties for VKL Cleaning (cleaning_company_id = 8)
INSERT INTO Property (address, bedrooms, property_type, cleaning_company_id) VALUES
('620 Orange Cosmos', 6, 'House', 8),
('1188 Challenge Dr', 4, 'House', 8);

-- Insert Properties for Zero Km Cleaning (cleaning_company_id = 9)
INSERT INTO Property (address, bedrooms, property_type, cleaning_company_id) VALUES
('940 Park Tarrence Cir', 4, 'House', 9),
('409 Satsuma Ln', 3, 'House', 9);

-- Insert Properties for Zenith Cleaning (cleaning_company_id = 10)
INSERT INTO Property (address, bedrooms, property_type, cleaning_company_id) VALUES
('1744 Lima Ave', 4, 'House', 10),
('1506 Enclave', 3, 'Condo', 10);
