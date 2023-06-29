interface RealtorProperty {
    "property_id": string,
    "list_price": number,
    "primary": boolean,
    "rent_to_own"?: any,
    "primary_photo": {
        "href": string
    },
    "source": {
        "id": string,
        "agents": { "office_name": any }[]
        "type": string,
        "spec_id"?: any,
        "plan_id"?: any
    },
    "community"?: any,
    "products": {
        "brand_name": string,
        "products": string[]
    },
    "listing_id": string,
    "matterport": boolean,
    "virtual_tours"?: any,
    "status": string,
    "permalink": string,
    "price_reduced_amount"?: any,
    "other_listings": {
        "rdc":
        {
            "listing_id": string,
            "status": string,
            "listing_key"?: any,
            "primary": boolean
        }[];
    },
    "description": {
        "beds": number,
        "baths": number,
        "baths_full": number,
        "baths_half": number,
        "baths_1qtr"?: any,
        "baths_3qtr"?: any,
        "garage"?: any,
        "stories": number,
        "type": string,
        "sub_type"?: any,
        "lot_sqft": number,
        "sqft": number,
        "year_built": number,
        "sold_price": number,
        "sold_date": string,
        "name"?: any
    },
    "location": {
        "street_view_url": string,
        "address": {
            "line": string,
            "postal_code": string,
            "state": string,
            "state_code": string,
            "city": string,
            "coordinate": {
                "lat"?: number,
                "lon"?: number
            }
        },
        "county": {
            "name": string,
            "fips_code": string
        }
    },
    "tax_record": {
        "public_record_id": string
    },
    "lead_attributes": {
        "show_contact_an_agent": boolean,
        "opcity_lead_attributes": {
            "cashback_enabled": boolean,
            "flip_the_market_enabled": boolean
        },
        "lead_type": string,
        "ready_connect_mortgage": {
            "show_contact_a_lender": boolean,
            "show_veterans_united": boolean
        }
    },
    "open_houses"?: any,
    "flags": {
        "is_coming_soon"?: boolean,
        "is_pending"?: boolean,
        "is_foreclosure"?: boolean,
        "is_contingent"?: boolean,
        "is_new_construction"?: boolean,
        "is_new_listing"?: boolean,
        "is_price_reduced"?: boolean,
        "is_plan"?: boolean,
        "is_subdivision"?: boolean
    },
    "list_date": string,
    "last_update_date": string,
    "coming_soon_date": string,
    "photos"?: { "href": string }[],
    "tags": string[],
    "branding":
    {
        "type": string,
        "photo"?: any,
        "name": string
    }[]
}

export default RealtorProperty