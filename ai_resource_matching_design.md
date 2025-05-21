# EcoLocal AI: AI Resource Matching Design

This document outlines the design for the AI Resource Matching system of the EcoLocal AI platform.

## 1. Goals of the AI Resource Matching System

This AI system aims to solve several key problems for users and projects on the EcoLocal AI platform:

*   **For Projects:**
    *   **Find Needed Volunteers:** Helps projects identify and connect with individuals who have the necessary skills, interests, and availability to contribute effectively.
    *   **Secure Materials & Equipment:** Facilitates finding donations or affordable sources of materials, tools, or equipment required for project execution.
    *   **Obtain Funding:** Connects projects with potential funding opportunities, whether from local grants, businesses, or crowdfunding.
    *   **Access Expertise & Mentorship:** Helps projects find individuals or organizations offering specialized knowledge, advice, or mentorship relevant to their challenges.
    *   **Discover Shared Resources:** Enables projects to find and utilize community assets like shared tool libraries, workshop spaces, or community gardens.
    *   **Reduce Resource Gaps:** Proactively identifies resource needs and suggests potential matches, minimizing delays and improving project success rates.

*   **For Resource Providers (Volunteers, Organizations, Businesses, Donors):**
    *   **Find Relevant Projects:** Helps providers discover sustainability projects that align with their interests, skills, values, or the types of resources they wish to offer.
    *   **Maximize Impact:** Enables providers to direct their resources (time, money, materials, skills) to projects where they can make the most meaningful contribution to local sustainability.
    *   **Streamline Offering Process:** Provides a clear way to list available resources and be matched with suitable opportunities without extensive manual searching.
    *   **Increase Engagement:** Fosters a sense of community and participation by connecting those willing to help with those needing it.

## 2. Input Data & Knowledge Base

Effective resource matching relies on rich, structured data about both project needs and available resources.

### 2.1. Project Needs Data

Captured through multiple channels:

*   **Structured Data from Project Planning & Simulation AI:**
    *   The `project_planning_simulation_ai_design.md` already details estimations for budget, materials, volunteer hours, and specific skills. This structured output is a primary input.
    *   Example: `{ "project_id": "proj123", "needs": [ {"type": "skill", "item": "Grant Writing", "quantity": "5 hours"}, {"type": "material", "item": "Native Saplings", "quantity": 50}, {"type": "funding", "amount": 500, "currency": "USD"} ] }`
*   **User-Added Specific Needs:**
    *   A dedicated section within each project's management view where users can explicitly list needs not captured by the planning AI or refine existing ones.
    *   This could be a form with fields like "Resource Type" (Skill, Material, Funding, Equipment, Space), "Description/Item," "Quantity/Amount," "Urgency," "Specific Requirements."
    *   Example: A user adds: "Need: Graphic Designer, Quantity: 1, Details: To create a promotional flyer for our upcoming event."
*   **NLP Analysis of Project Descriptions & Updates:**
    *   The system can analyze text from project descriptions, task details, forum posts related to the project, and updates.
    *   Techniques like Named Entity Recognition (NER) can extract keywords like "looking for volunteers," "need shovels," "seeking funding." Relation extraction can link these needs to the project.
*   **Implicit Needs from Project Type & Phase:**
    *   The system might infer common needs based on the project category (e.g., "community garden projects often need compost") or its current phase (e.g., "projects in the initial planning phase often need help with research or outreach").

### 2.2. Resource Provider Data

Captured through user profiles and dedicated "Offer Resources" sections:

*   **Volunteers:**
    *   **User Profiles:**
        *   **Skills:** A structured list, potentially chosen from a predefined ontology (see Knowledge Base), e.g., "Gardening," "Web Development," "Event Planning," "Teaching." Users can also add custom skills.
        *   **Interests:** Chosen from categories like "Renewable Energy," "Waste Reduction," "Biodiversity Conservation," "Community Education."
        *   **Availability:** General availability (e.g., "Weekends," "Evenings," specific hours per week).
        *   **Location:** Zip code or more precise location (with privacy controls) for geospatial matching.
        *   **Past Experience:** Optionally, a brief description of relevant experience or roles in previous projects.
*   **Organizations/Businesses (Local Companies, Non-profits, Community Groups):**
    *   **Dedicated "Offer Resources" Form/Profile:**
        *   **Type of Resource Offered:** (e.g., Materials, Funding, Expertise, Mentorship, Volunteer Teams, Space).
        *   **Specifics:**
            *   Materials: Type of materials (e.g., "Used lumber," "Office supplies," "Gardening tools"), quantity, condition, availability.
            *   Funding: Amount range, eligibility criteria (if any), application process/link.
            *   Expertise/Mentorship: Areas of expertise (e.g., "Sustainable business practices," "Marketing for non-profits," "Legal advice for community projects"), mode of delivery (e.g., workshops, one-on-one consultations).
            *   Volunteer Teams: Group size, types of activities they can support.
        *   **Location:** Business address.
        *   **Contact Information:** For project liaisons.
*   **Local Government/NGOs (as data sources, potentially with profiles):**
    *   **Grant Opportunities:** Scraped from public websites or manually entered listings (name, description, eligibility, deadline, link).
    *   **Support Programs:** Information about municipal programs like free mulch days, tool lending libraries, educational workshops.
*   **Community Asset Inventory:**
    *   A curated list of shared community resources:
        *   Tool Libraries: Available tools, borrowing conditions.
        *   Community Spaces: Meeting rooms, workshop areas, availability, booking info.
        *   Community Gardens with shared plots/resources.
    *   This could be managed by platform administrators or community moderators.

### 2.3. Knowledge Base

A structured knowledge base is crucial for standardizing descriptions and enabling effective matching:

*   **Ontologies/Taxonomies:**
    *   **Skills Ontology:** A hierarchical list of skills, from general (e.g., "Communication") to specific (e.g., "Public Speaking," "Social Media Marketing"). Helps normalize user-inputted skills.
    *   **Resource Type Taxonomy:** Defines categories and subcategories of resources (e.g., Materials -> Construction -> Lumber; Expertise -> Technical -> Software Development).
    *   **Project Category Taxonomy:** Classifies projects (e.g., Energy -> Solar Installation; Waste -> Composting Program).
    *   **Sustainability Domain Keywords:** A controlled vocabulary of terms related to sustainability topics.
*   **Synonym Lists:** To map different terms to a standard concept (e.g., "funding," "grant," "sponsorship" might all map to a "Financial Support" concept).
*   **Geographic Data:** Administrative boundaries, zip codes, potentially latitude/longitude for more precise location-based matching.

## 3. Core AI & Algorithmic Components (Conceptual)

### 3.1. Needs & Resource Profiling (NLP & Structured Data Analysis)

*   **Models/Logic:**
    *   **NLP Techniques for Unstructured Text:**
        *   **Named Entity Recognition (NER):** To identify entities like skills, materials, roles, organization names, locations from project descriptions or resource offers. Custom NER models might be trained for sustainability-specific terms.
        *   **Keyword/Keyphrase Extraction:** To pull out important terms.
        *   **Text Classification:** To categorize project needs or resource offers based on the defined taxonomies (e.g., classify a textual need description into "Skill Request" or "Material Request").
        *   **Relation Extraction:** To understand the relationships between extracted entities (e.g., "Project X *needs* Skill Y," "Organization Z *offers* Material A").
    *   **Structured Data Processing:**
        *   Directly use data from forms (project needs forms, volunteer skill lists, organization offer forms).
        *   Normalize structured data against the Knowledge Base ontologies (e.g., map user-entered "knows HTML" to "Web Development" skill).
    *   **Vectorization (Embeddings):** Convert textual descriptions of needs and offers into numerical vectors (e.g., using techniques like TF-IDF, Word2Vec, Sentence-BERT). This allows for semantic similarity calculations.
*   **Function:**
    *   The system processes all input data (structured forms, free text) to create standardized, machine-readable profiles for both project needs and available resources.
    *   **Project Need Profile Example:** `{"project_id": "proj123", "need_vectors": [vector_for_grant_writing, vector_for_saplings], "required_skills": ["Grant Writing", "Event Planning"], "required_materials": ["Native Saplings"], "location_preference": "local_zip_code_area", "urgency": "high"}`
    *   **Resource Offer Profile Example (Volunteer):** `{"user_id": "user456", "offer_vectors": [vector_for_profile_description], "skills_offered": ["Grant Writing", "Community Outreach"], "availability": "weekends", "location": "zip_code"}`

### 3.2. Matching Algorithm

*   **Models/Logic:**
    *   **Similarity Metrics:**
        *   **Cosine Similarity:** Calculate the cosine similarity between the vector embeddings of project need descriptions and resource offer descriptions. Higher similarity indicates a better semantic match.
        *   **Jaccard Index / Set Overlap:** For structured attributes like skills or interests, calculate the overlap between the set of skills needed by a project and the set of skills offered by a volunteer.
    *   **Rule-Based Matching:** Implement hard filters or boosts based on critical criteria:
        *   **Location Proximity:** For volunteer tasks requiring physical presence or local material delivery, filter matches based on geographic proximity (e.g., within X miles/km, same city/county).
        *   **Availability Match:** For volunteers, ensure their stated availability aligns with project needs (e.g., if a project needs weekend help).
        *   **Mandatory Skills/Qualifications:** If a project explicitly states a mandatory skill, filter out providers who don't possess it.
        *   **Resource Type Matching:** Ensure the fundamental type of resource matches (e.g., don't match a funding request with an offer of volunteer time unless there's a specific conversion pathway).
    *   **Collaborative Filtering (Future Enhancement):**
        *   If enough interaction data exists (projects successfully connect with resources), this could suggest matches based on patterns like "projects similar to X successfully utilized resources from providers similar to Y."
    *   **Graph-Based Matching (Advanced):**
        *   Represent projects, resources, skills, and locations as nodes in a graph. Edges represent relationships (needs, offers, possesses_skill, located_in).
        *   Graph algorithms can find paths or communities that indicate strong multi-faceted matches.
    *   **Hybrid Approach:** Likely, a combination of these methods will be most effective. For instance, use rule-based filtering first, then apply similarity metrics to the narrowed-down candidates.
*   **Function:**
    *   The system takes a specific project need (or a resource offer) as input.
    *   It queries the database of available resource offers (or project needs).
    *   Applies rule-based filters (location, availability, mandatory criteria).
    *   Calculates match scores for the remaining candidates using similarity metrics on their profiles.
    *   Generates a ranked list of potential matches.

### 3.3. Recommendation & Prioritization

*   **Models/Logic:**
    *   **Match Score:** The primary factor for ranking, derived from the matching algorithm.
    *   **Urgency:** Needs flagged as "urgent" by projects might be prioritized.
    *   **Provider Preferences/Goals:** Resource providers might specify preferences (e.g., "only interested in environmental education projects"), which can influence ranking.
    *   **Project Impact / Visibility (Optional):** Platform administrators might have a way to boost certain high-impact projects or those from trusted organizations.
    *   **Freshness:** New offers or needs might be temporarily boosted to increase visibility.
    *   **Diversity of Matches:** Ensure a user isn't always shown the exact same type of match; introduce some variety if scores are close.
    *   **User Feedback:** Incorporate feedback from past match interactions (see Section 5).
*   **Function:**
    *   Presents a ranked list of potential matches to the user (project lead or resource provider).
    *   Each match displayed should include:
        *   Name of the project/provider.
        *   Key matching attributes (e.g., "Offers skill: Grant Writing," "Needs: Volunteers for tree planting").
        *   The match score or a qualitative indicator (e.g., "Strong Match," "Good Match").
        *   A clear call to action (e.g., "View Details," "Express Interest").

### 3.4. Geospatial Considerations

*   **Logic:**
    *   Store latitude/longitude for projects (if location-specific) and resource providers (e.g., volunteer's home base, organization's address).
    *   Use geospatial queries (e.g., PostGIS functions if using PostgreSQL) to find resources/projects within a certain radius or administrative boundary (city, county).
    *   Allow users to specify their preferred service radius (e.g., "willing to volunteer within 10 miles").
    *   For non-physical resources (e.g., remote expertise, online funding), location might be less critical or used for broader regional matching.
*   **Function:** Filters and prioritizes matches based on physical proximity where relevant, ensuring practical connections for location-dependent resources.

## 4. User Interaction & Workflow (Conceptual)

### 4.1. For Projects Seeking Resources:

1.  **Expressing Needs:**
    *   Needs are automatically populated from the Project Planning AI's outputs.
    *   A "Manage Resources" or "Find Support" section in their project dashboard.
    *   Users can manually add/edit specific needs (skills, materials, funding) via a form.
    *   They can mark needs as "Urgent."
2.  **Viewing Matches:**
    *   A "Suggested Matches" tab within the "Find Support" section.
    *   Matches are listed with details (provider name, what they offer, why it's a match, location if relevant).
    *   Filtering options for matches (by resource type, match strength, location).
3.  **Interacting with Matches:**
    *   "View Profile" button to see more details about the volunteer/organization.
    *   "Express Interest" or "Request Connection" button. This might send a notification to the resource provider.

### 4.2. For Resource Providers:

1.  **Listing Offerings:**
    *   Volunteers fill out their profile with skills, interests, availability, location.
    *   Organizations use a dedicated "Offer Resources" form to list materials, funding, expertise, etc.
    *   They can specify any conditions or preferences for how their resources are used.
2.  **Discovering Projects:**
    *   A "Find Projects to Support" or "Browse Opportunities" section.
    *   Recommended projects matching their offerings are displayed.
    *   Search and filter options (by project category, resource type needed, location).
3.  **Interacting with Matches:**
    *   "View Project Details" button.
    *   "Offer Help" or "Connect with Project" button. This sends a notification to the project lead.

### 4.3. Facilitating Connection:

1.  **Initial Notification:** When one party expresses interest, the other party receives a notification (in-app and/or email) with details of the potential match and who initiated contact.
2.  **Mutual Agreement:** Both parties must agree to connect further.
3.  **Information Exchange:** Once both agree, the platform can facilitate sharing of contact information (e.g., email addresses, or an internal messaging system if available on the platform).
4.  **Anonymized Contact (Optional):** For initial inquiries, the system could allow messages to be passed through without revealing direct contact details until both parties are comfortable.

## 5. Feedback & Learning Loop

The system's accuracy and usefulness will improve over time through feedback:

*   **User Feedback on Match Quality:**
    *   After a match is suggested or a connection is facilitated, prompt users for feedback:
        *   "Was this match relevant?" (Yes/No/Partially)
        *   Simple rating (e.g., 1-5 stars).
        *   Optional short comment.
*   **Tracking Connection Success:**
    *   Did the project and provider successfully connect after the introduction? (User-reported)
    *   Did the resource exchange actually happen and was it helpful? (User-reported, harder to track but valuable)
*   **Implicit Feedback:**
    *   High rate of "Express Interest" clicks on certain types of matches.
    *   Low interaction rates with other types of matches.
*   **Model Retraining/Refinement:**
    *   This feedback is collected and used to:
        *   Refine the matching algorithms (e.g., adjust weights for different features, improve similarity calculations).
        *   Update the Knowledge Base (e.g., add new skills or synonyms that emerge from user input).
        *   Improve the NLP models by adding new training data based on how users describe their needs and offers.
    *   If collaborative filtering is used, successful pairings directly strengthen the model.

By continuously learning from user interactions and outcomes, the AI Resource Matching system will become increasingly effective at connecting projects with the resources they need to succeed and helping providers make impactful contributions.
