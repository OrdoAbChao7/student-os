ALTER TABLE `experienceEvents` MODIFY COLUMN `sourceType` enum('task','course','learning','project','review','manual') NOT NULL;--> statement-breakpoint
ALTER TABLE `courses` ADD `skillId` int;--> statement-breakpoint
ALTER TABLE `projects` ADD `skillId` int;