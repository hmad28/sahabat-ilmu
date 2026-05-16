CREATE TABLE IF NOT EXISTS "activity_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"action" varchar(50) NOT NULL,
	"entity_type" varchar(50) NOT NULL,
	"entity_id" integer,
	"description" text NOT NULL,
	"metadata" json,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "feedback" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"email" varchar(255),
	"category" varchar(50) DEFAULT 'general' NOT NULL,
	"message" text NOT NULL,
	"status" varchar(20) DEFAULT 'new' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kajian_schedule" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"ustadz" varchar(100),
	"location" varchar(255),
	"address" text,
	"city" varchar(100),
	"province" varchar(100),
	"date" timestamp NOT NULL,
	"time" varchar(50),
	"description" text,
	"source_url" text,
	"scraped_at" timestamp DEFAULT now() NOT NULL,
	"is_active" varchar(10) DEFAULT 'true',
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "prayer_times" (
	"id" serial PRIMARY KEY NOT NULL,
	"province" varchar(100) NOT NULL,
	"city" varchar(100) NOT NULL,
	"date" timestamp NOT NULL,
	"fajr" varchar(5) NOT NULL,
	"sunrise" varchar(5) NOT NULL,
	"dhuhr" varchar(5) NOT NULL,
	"asr" varchar(5) NOT NULL,
	"maghrib" varchar(5) NOT NULL,
	"isha" varchar(5) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "quran_cache" (
	"id" serial PRIMARY KEY NOT NULL,
	"surah_number" integer NOT NULL,
	"surah_name" varchar(50) NOT NULL,
	"surah_name_arabic" varchar(50) NOT NULL,
	"ayah_number" integer NOT NULL,
	"arabic_text" text NOT NULL,
	"translation_id" text NOT NULL,
	"transliteration_id" text,
	"audio_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_bookmarks" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"surah_number" integer NOT NULL,
	"ayah_number" integer NOT NULL,
	"note" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM pg_constraint WHERE conname = 'activity_logs_user_id_users_id_fk'
	) THEN
		ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
	END IF;
END $$;--> statement-breakpoint
DO $$ BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM pg_constraint WHERE conname = 'user_bookmarks_user_id_users_id_fk'
	) THEN
		ALTER TABLE "user_bookmarks" ADD CONSTRAINT "user_bookmarks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
	END IF;
END $$;
