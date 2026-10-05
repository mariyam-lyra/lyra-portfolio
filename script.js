const SUPABASE_URL = "https://gakszrbqogybnutbmoeh.supabase.co";
const SUPABASE_KEY = "sb_publishable_8QMIPwz5HPMdIIKi-C9C_w_vTVIsiYI";


// =========================================
// LOAD PROJECTS FROM SUPABASE
// =========================================

async function loadProjects() {
    try {
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/projects?select=*&order=project_number.asc`,
            {
                method: "GET",
                headers: {
                    apikey: SUPABASE_KEY
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Supabase project error: ${response.status}`);
        }

        const projects = await response.json();

        console.log("Projects loaded from Supabase:", projects);

        const projectCards = document.querySelectorAll(".project-card");

        projects.forEach((project, index) => {
            const card = projectCards[index];

            if (!card) return;

            const title = card.querySelector("h3");

            if (title && project.title) {
                title.textContent = project.title;
            }

            const paragraphs = card.querySelectorAll("p");

            if (paragraphs.length > 0 && project.description) {
                paragraphs[0].textContent = project.description;
            }

            const number = card.querySelector(".project-number");

            if (number && project.project_number) {
                number.textContent = project.project_number;
            }

            const emoji = card.querySelector(".project-emoji");

            if (emoji && project.emoji) {
                emoji.textContent = project.emoji;
            }

            const techContainer = card.querySelector(".project-tech");

            if (techContainer && project.technologies) {
                techContainer.innerHTML = "";

                project.technologies.split(",").forEach((technology) => {
                    const tag = document.createElement("span");

                    tag.textContent = technology.trim();

                    techContainer.appendChild(tag);
                });
            }

            const websiteLink = card.querySelector(".project-link");

            if (websiteLink) {
                if (project.website_url) {
                    websiteLink.href = project.website_url;
                    websiteLink.target = "_blank";
                    websiteLink.style.display = "inline-block";
                } else {
                    websiteLink.style.display = "none";
                }
            }
        });

    } catch (error) {
        console.error(
            "Error loading projects from Supabase:",
            error
        );
    }
}


// =========================================
// LOAD PROFILE FROM SUPABASE
// =========================================

async function loadProfile() {
    try {
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/profile?select=*`,
            {
                method: "GET",
                headers: {
                    apikey: SUPABASE_KEY
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Supabase profile error: ${response.status}`);
        }

        const profiles = await response.json();

        console.log(
            "Profile loaded from Supabase:",
            profiles
        );

        if (profiles.length === 0) {
            console.log("No profile found.");
            return;
        }

        const profile = profiles[0];

        // Name
        const heroName = document.querySelector("#home h1");

        if (heroName && profile.name) {
            const nameParts = profile.name.split(" ");

            if (nameParts.length >= 2) {
                heroName.innerHTML =
                    `${nameParts[0]} <span>${nameParts.slice(1).join(" ")}</span>`;
            } else {
                heroName.textContent = profile.name;
            }
        }

        // Professional title
        const heroTitle = document.querySelector("#home h2");

        if (heroTitle && profile.title) {
            heroTitle.textContent = profile.title;
        }

        // Hero description
        const heroDescription =
            document.querySelector("#home .hero-text > p");

        if (heroDescription && profile.hero_description) {
            heroDescription.textContent =
                profile.hero_description;
        }

        // About Me
        const aboutSection =
            document.querySelector("#about");

        if (aboutSection && profile.about) {

            const aboutParagraphs =
                aboutSection.querySelectorAll("p");

            if (aboutParagraphs.length > 0) {
                aboutParagraphs[0].textContent =
                    profile.about;
            }

            if (aboutParagraphs.length > 1) {
                aboutParagraphs[1].style.display = "none";
            }
        }

        // Email
        const emailLink = document.querySelector(".contact-email");

if (emailLink && profile.email) {
    emailLink.href = `mailto:${profile.email}`;
}

        // Phone
        const phoneLink =
            document.querySelector('a[href^="tel:"]');

        if (phoneLink && profile.phone) {
            phoneLink.href =
                `tel:${profile.phone}`;

            phoneLink.textContent =
                profile.phone;
        }

        // Location
        const contactDetails =
            document.querySelector(".contact-details");

        if (contactDetails && profile.location) {

            const locationText =
                contactDetails.querySelector("p");

            if (locationText) {
                locationText.textContent =
                    profile.location;
            }
        }

    } catch (error) {
        console.error(
            "Error loading profile from Supabase:",
            error
        );
    }
}


// =========================================
// LOAD SKILLS FROM SUPABASE
// =========================================

async function loadSkills() {
    try {
        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/skills?select=*&order=skill_order.asc`,
            {
                method: "GET",
                headers: {
                    apikey: SUPABASE_KEY
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Supabase skills error: ${response.status}`);
        }

        const skills = await response.json();

        console.log("Skills loaded from Supabase:", skills);

        const skillsGrid =
            document.querySelector(".skills-grid");

        if (!skillsGrid) {
            console.log("Skills grid not found.");
            return;
        }

        // IMPORTANT:
        // If Supabase has no skills, keep the original
        // Skills & Tools section instead of deleting it.
        if (!skills || skills.length === 0) {
            console.log(
                "No skills found in Supabase. Keeping existing skills."
            );
            return;
        }

        // Only clear the existing cards AFTER
        // confirming that Supabase returned skills.
        skillsGrid.innerHTML = "";

        // Create a card for every skill
        skills.forEach((skill) => {

            const card = document.createElement("div");

            card.className = "skill-card";

            card.innerHTML = `
                <div class="skill-icon">
                    ${skill.emoji || "✦"}
                </div>

                <h3>${skill.name}</h3>

                <p>${skill.category || ""}</p>
            `;

            skillsGrid.appendChild(card);
        });

    } catch (error) {

        // If Supabase fails, DON'T delete the existing skills.
        console.error(
            "Error loading skills from Supabase:",
            error
        );

        console.log(
            "Keeping the original Skills & Tools section."
        );
    }
}


// =========================================
// START EVERYTHING
// =========================================

document.addEventListener("DOMContentLoaded", () => {

    loadProjects();

    loadProfile();

    loadSkills();

});