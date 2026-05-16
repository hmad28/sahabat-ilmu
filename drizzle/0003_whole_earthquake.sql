CREATE TABLE IF NOT EXISTS "kajian_comments" (
	"id" serial PRIMARY KEY NOT NULL,
	"kajian_id" integer NOT NULL,
	"name" varchar(100) NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "kajian_likes" (
	"id" serial PRIMARY KEY NOT NULL,
	"kajian_id" integer NOT NULL,
	"client_id" varchar(80) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM pg_constraint WHERE conname = 'kajian_comments_kajian_id_kajian_id_fk'
	) THEN
		ALTER TABLE "kajian_comments" ADD CONSTRAINT "kajian_comments_kajian_id_kajian_id_fk" FOREIGN KEY ("kajian_id") REFERENCES "public"."kajian"("id") ON DELETE cascade ON UPDATE no action;
	END IF;
END $$;--> statement-breakpoint
DO $$ BEGIN
	IF NOT EXISTS (
		SELECT 1 FROM pg_constraint WHERE conname = 'kajian_likes_kajian_id_kajian_id_fk'
	) THEN
		ALTER TABLE "kajian_likes" ADD CONSTRAINT "kajian_likes_kajian_id_kajian_id_fk" FOREIGN KEY ("kajian_id") REFERENCES "public"."kajian"("id") ON DELETE cascade ON UPDATE no action;
	END IF;
END $$;--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "kajian_likes_kajian_id_client_id_unique" ON "kajian_likes" USING btree ("kajian_id","client_id");
