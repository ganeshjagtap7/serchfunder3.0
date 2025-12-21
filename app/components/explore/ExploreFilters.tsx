"use client";

import { useState } from "react";

interface ExploreFiltersProps {
  filters: {
    role: string;
    interests: string[];
  };
  onFiltersChange: (filters: any) => void;
}

const ROLE_OPTIONS = ["Investor", "Entrepreneur", "Broker"];
const INTEREST_OPTIONS = ["SaaS", "Manufacturing", "Healthcare", "Ecommerce"];

export default function ExploreFilters({ filters, onFiltersChange }: ExploreFiltersProps) {
  const [selectedRoles, setSelectedRoles] = useState<string[]>(
    filters.role === "all" ? [] : [filters.role]
  );
  const [selectedInterests, setSelectedInterests] = useState<string[]>(filters.interests);

  const handleRoleToggle = (role: string) => {
    const newRoles = selectedRoles.includes(role)
      ? selectedRoles.filter((r) => r !== role)
      : [...selectedRoles, role];

    setSelectedRoles(newRoles);
    onFiltersChange({
      role: newRoles.length === 0 ? "all" : newRoles[0],
      interests: selectedInterests,
    });
  };

  const handleInterestToggle = (interest: string) => {
    const newInterests = selectedInterests.includes(interest)
      ? selectedInterests.filter((i) => i !== interest)
      : [...selectedInterests, interest];

    setSelectedInterests(newInterests);
    onFiltersChange({
      role: selectedRoles.length === 0 ? "all" : selectedRoles[0],
      interests: newInterests,
    });
  };

  const handleReset = () => {
    setSelectedRoles([]);
    setSelectedInterests([]);
    onFiltersChange({ role: "all", interests: [] });
  };

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-2xl overflow-hidden border border-border-light dark:border-border-dark sticky top-[84px]">
      <div className="px-4 py-3 border-b border-border-light dark:border-border-dark flex justify-between items-center">
        <h2 className="text-lg font-bold">Filters</h2>
        <span
          onClick={handleReset}
          className="text-xs text-primary cursor-pointer hover:underline"
        >
          Reset
        </span>
      </div>

      <div className="p-4 flex flex-col gap-5">
        <div>
          <h3 className="font-bold text-xs mb-3 text-text-secondary dark:text-text-secondary-dark uppercase tracking-wider">
            Role
          </h3>
          <div className="flex flex-col gap-2">
            {ROLE_OPTIONS.map((role) => (
              <label
                key={role}
                className="flex cursor-pointer items-center gap-3 hover:bg-black/5 dark:hover:bg-white/5 p-1 -ml-1 rounded transition-colors"
              >
                <input
                  type="checkbox"
                  checked={selectedRoles.includes(role)}
                  onChange={() => handleRoleToggle(role)}
                  className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                />
                <span className="text-sm font-medium">{role}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-bold text-xs mb-3 text-text-secondary dark:text-text-secondary-dark uppercase tracking-wider">
            Interests
          </h3>
          <div className="flex flex-wrap gap-2">
            {INTEREST_OPTIONS.map((interest) => (
              <button
                key={interest}
                onClick={() => handleInterestToggle(interest)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                  selectedInterests.includes(interest)
                    ? "bg-primary text-white hover:bg-primary-hover"
                    : "bg-transparent border border-border-dark/20 dark:border-border-light/20 hover:bg-black/5 dark:hover:bg-white/10"
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-3 border-t border-border-light dark:border-border-dark hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer transition-colors text-center">
        <span className="text-primary text-sm font-medium">Advanced search</span>
      </div>
    </div>
  );
}
