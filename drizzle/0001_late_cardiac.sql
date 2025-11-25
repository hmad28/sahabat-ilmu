CREATE TYPE "public"."role" AS ENUM('SUPER_ADMIN', 'AUTHOR');--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255) NOT NULL,
	"role" "role" DEFAULT 'AUTHOR' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "kajian" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "kajian" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "kajian" ADD COLUMN "author_id" serial NOT NULL;--> statement-breakpoint
ALTER TABLE "kajian" ADD CONSTRAINT "kajian_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;