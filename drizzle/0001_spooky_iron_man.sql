CREATE TABLE `aiReports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`reportDate` varchar(10) NOT NULL,
	`growthScore` int NOT NULL,
	`summary` text NOT NULL,
	`insight` text NOT NULL,
	`tomorrowPlan` json NOT NULL,
	`sourceSnapshot` json NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `aiReports_id` PRIMARY KEY(`id`),
	CONSTRAINT `ai_report_user_date_uq` UNIQUE(`userId`,`reportDate`)
);
--> statement-breakpoint
CREATE TABLE `courses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(180) NOT NULL,
	`description` text,
	`color` varchar(20) NOT NULL DEFAULT '#6875F5',
	`progress` int NOT NULL DEFAULT 0,
	`resourceUrl` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `courses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `dailyReviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`reviewDate` varchar(10) NOT NULL,
	`reflection` text NOT NULL,
	`highlight` text,
	`challenge` text,
	`tomorrowFocus` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `dailyReviews_id` PRIMARY KEY(`id`),
	CONSTRAINT `daily_review_user_date_uq` UNIQUE(`userId`,`reviewDate`)
);
--> statement-breakpoint
CREATE TABLE `experienceEvents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`skillId` int NOT NULL,
	`sourceType` enum('task','learning','project','review','manual') NOT NULL,
	`sourceId` int,
	`points` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `experienceEvents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `learningRecords` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`courseId` int NOT NULL,
	`skillId` int,
	`title` varchar(200) NOT NULL,
	`notes` text,
	`resourceUrl` varchar(500),
	`durationMinutes` int NOT NULL DEFAULT 0,
	`completedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `learningRecords_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `milestones` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`projectId` int NOT NULL,
	`title` varchar(180) NOT NULL,
	`status` enum('todo','in_progress','done') NOT NULL DEFAULT 'todo',
	`dueAt` timestamp,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `milestones_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`headline` varchar(180),
	`timezone` varchar(80) NOT NULL DEFAULT 'Asia/Shanghai',
	`weeklyFocusHours` int NOT NULL DEFAULT 12,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `profiles_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(180) NOT NULL,
	`description` text,
	`status` enum('idea','planning','active','paused','completed') NOT NULL DEFAULT 'idea',
	`progress` int NOT NULL DEFAULT 0,
	`techStack` json NOT NULL,
	`targetAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `projects_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `skills` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(100) NOT NULL,
	`category` varchar(80) NOT NULL DEFAULT 'General',
	`color` varchar(20) NOT NULL DEFAULT '#6875F5',
	`experience` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `skills_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`courseId` int,
	`projectId` int,
	`skillId` int,
	`title` varchar(240) NOT NULL,
	`description` text,
	`category` varchar(80) NOT NULL DEFAULT 'Focus',
	`tags` json NOT NULL,
	`priority` enum('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
	`status` enum('todo','in_progress','done') NOT NULL DEFAULT 'todo',
	`dueAt` timestamp,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tasks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `timeEntries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`courseId` int,
	`projectId` int,
	`title` varchar(180) NOT NULL,
	`kind` enum('learning','project','focus','other') NOT NULL DEFAULT 'focus',
	`durationMinutes` int NOT NULL DEFAULT 0,
	`startedAt` timestamp NOT NULL,
	`endedAt` timestamp,
	`isRunning` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `timeEntries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE INDEX `courses_user_idx` ON `courses` (`userId`);--> statement-breakpoint
CREATE INDEX `experience_user_skill_idx` ON `experienceEvents` (`userId`,`skillId`);--> statement-breakpoint
CREATE INDEX `learning_records_user_course_idx` ON `learningRecords` (`userId`,`courseId`);--> statement-breakpoint
CREATE INDEX `milestones_project_user_idx` ON `milestones` (`projectId`,`userId`);--> statement-breakpoint
CREATE INDEX `projects_user_idx` ON `projects` (`userId`);--> statement-breakpoint
CREATE INDEX `skills_user_idx` ON `skills` (`userId`);--> statement-breakpoint
CREATE INDEX `tasks_user_status_idx` ON `tasks` (`userId`,`status`);--> statement-breakpoint
CREATE INDEX `tasks_user_due_idx` ON `tasks` (`userId`,`dueAt`);--> statement-breakpoint
CREATE INDEX `time_entries_user_start_idx` ON `timeEntries` (`userId`,`startedAt`);