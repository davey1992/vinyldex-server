-- --------------------------------------------------------
-- Database Schema for VinDex
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS "users" (
    "id" INTEGER NOT NULL,
    "display_name" VARCHAR(25) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "account_type" INTEGER NOT NULL,
    "visibility" INTEGER NOT NULL,
    "state" JSONB NULL DEFAULT NULL,
    "properties" JSONB NULL DEFAULT NULL,
    "created_timestamp" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_timestamp" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id"),
    CONSTRAINT "unique_display_name" UNIQUE ("display_name"),
    CONSTRAINT "unique_email" UNIQUE ("email")
);

CREATE TABLE IF NOT EXISTS "media_conditions" (
    "id" INTEGER NOT NULL,
    "condition" VARCHAR(20) NOT NULL,
    "description" VARCHAR(500) NULL DEFAULT NULL,
    "created_timestamp" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_timestamp" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id"),
    CONSTRAINT "unique_media_condition" UNIQUE ("condition")
);

CREATE TABLE IF NOT EXISTS "genres" (
    "id" INTEGER NOT NULL,
    "parent_id" INTEGER NULL DEFAULT NULL,
    "genre_name" VARCHAR NOT NULL,
    "genre_description" VARCHAR(500) NULL DEFAULT NULL,
    "created_timestamp" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_timestamp" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id"),
    CONSTRAINT "unique_genre_name" UNIQUE ("genre_name"),
    CONSTRAINT "fk_genre_parent_id" FOREIGN KEY ("parent_id") REFERENCES "genres" ("id") ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS "entries" (
    "id" INTEGER NOT NULL,
    "parent_id" INTEGER NULL DEFAULT NULL,
    "user_id" INTEGER NOT NULL,
    "media_condition" INTEGER NULL DEFAULT NULL,
    "sleeve_condition" INTEGER NULL DEFAULT NULL,
    "title" VARCHAR(150) NOT NULL,
    "artist" VARCHAR(150) NULL DEFAULT NULL,
    "location" VARCHAR(150) NULL DEFAULT NULL,
    "item_ref" VARCHAR(150) NULL DEFAULT NULL,
    "personal_rating" INTEGER NULL DEFAULT NULL,
    "bpm" INTEGER NULL DEFAULT NULL,
    "spin_speed" INTEGER NULL DEFAULT NULL,
    "art_work" VARCHAR(500) NULL DEFAULT NULL,
    "media_format" INTEGER NULL DEFAULT NULL,
    "camelot_code" VARCHAR(10) NULL DEFAULT NULL,
    "internal_duplicate" INTEGER NULL DEFAULT NULL,
    "label_name" VARCHAR(150) NULL DEFAULT NULL,
    "country_code" VARCHAR(3) NULL DEFAULT NULL,
    "purchase_price" NUMERIC(7,2) NULL DEFAULT NULL,
    "release_year" INTEGER NULL DEFAULT NULL,
    "notes" VARCHAR(500) NULL DEFAULT NULL,
    "discogs_release_id" INTEGER NULL DEFAULT NULL,
    "discogs_master_id" INTEGER NULL DEFAULT NULL,
    "catalog_number" VARCHAR(50) NULL DEFAULT NULL,
    "properties" JSONB NULL DEFAULT NULL,
    "created_timestamp" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_timestamp" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id"),
    CONSTRAINT "fk_entry_hierarchy" FOREIGN KEY ("parent_id") REFERENCES "entries" ("id") ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT "fk_entry_user" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION,
    CONSTRAINT "fk_media_condition" FOREIGN KEY ("media_condition") REFERENCES "media_conditions" ("id") ON UPDATE CASCADE ON DELETE SET NULL,
    CONSTRAINT "fk_sleeve_condition" FOREIGN KEY ("sleeve_condition") REFERENCES "media_conditions" ("id") ON UPDATE CASCADE ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS "entry_genres" (
    "id" INTEGER NOT NULL,
    "entry_id" INTEGER NOT NULL,
    "genre_id" INTEGER NOT NULL,
    "created_timestamp" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_timestamp" TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id"),
    CONSTRAINT "unique_entry_id_genre_id" UNIQUE ("entry_id", "genre_id"),
    CONSTRAINT "fk_entry_genres_entry_id" FOREIGN KEY ("entry_id") REFERENCES "entries" ("id") ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT "fk_entry_genres_genre_id" FOREIGN KEY ("genre_id") REFERENCES "genres" ("id") ON UPDATE NO ACTION ON DELETE NO ACTION
);

CREATE TABLE IF NOT EXISTS "lists" (
    "id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "description" VARCHAR(500) NULL DEFAULT NULL,
    "type" INTEGER NOT NULL,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "state" JSONB NULL DEFAULT NULL,
    "properties" JSONB NULL DEFAULT NULL,
    "created_timestamp" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_timestamp" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id"),
    CONSTRAINT "unique_user_list_name" UNIQUE ("user_id", "name"),
    CONSTRAINT "fk_lists_user_id" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "list_entries" (
    "id" INTEGER NOT NULL,
    "list_id" INTEGER NOT NULL,
    "entry_id" INTEGER NOT NULL,
    "position_order" INTEGER NULL DEFAULT NULL,
    "created_timestamp" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_timestamp" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id"),
    CONSTRAINT "fk_list_entries_entry_id" FOREIGN KEY ("entry_id") REFERENCES "entries" ("id") ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT "fk_list_entries_list_id" FOREIGN KEY ("list_id") REFERENCES "lists" ("id") ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "relationships" (
    "id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "target_user_id" INTEGER NOT NULL,
    "relationship_types" JSONB NOT NULL,
    "created_timestamp" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_timestamp" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id"),
    CONSTRAINT "unique_user_target" UNIQUE ("user_id", "target_user_id"),
    CONSTRAINT "fk_relationship_user_id" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT "fk_relationship_user_target_id" FOREIGN KEY ("target_user_id") REFERENCES "users" ("id") ON UPDATE CASCADE ON DELETE CASCADE
);