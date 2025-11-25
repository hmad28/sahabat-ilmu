CREATE TABLE "kajian" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"excerpt" text NOT NULL,
	"content" text NOT NULL,
	"cover_image" text,
	"gallery" json DEFAULT '[]'::json,
	"ustadz" varchar(100),
	"location" varchar(100),
	"date" timestamp,
	"category" varchar(50) DEFAULT 'kajian',
	"status" varchar(20) DEFAULT 'published',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "kajian_slug_unique" UNIQUE("slug")
);
