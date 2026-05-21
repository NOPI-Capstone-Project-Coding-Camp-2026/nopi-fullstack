import { useState } from 'react';
import { ChevronDownIcon } from '../ui/AppIcons';

const FAQAccordion = ({ items = [] }) => {
  const [openIndex, setOpenIndex] = useState(0);

  const handleToggle = (index) => {
    setOpenIndex((currentIndex) => (currentIndex === index ? null : index));
  };

  return (
    <div className="divide-y divide-[#f2e4d7]">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const triggerId = `faq-question-${index}`;
        const panelId = `faq-answer-${index}`;

        return (
          <div key={item.question} className="bg-white">
            <h2>
              <button
                id={triggerId}
                type="button"
                className="flex w-full min-w-0 items-start justify-between gap-4 px-4 py-4 text-left transition hover:bg-[#fffaf4] focus:outline-none focus-visible:bg-[#fff8f0] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#ea8327] sm:px-6 sm:py-5"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => handleToggle(index)}
              >
                <span className="flex min-w-0 items-start gap-3 sm:gap-4">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#fff1e4] text-[0.72rem] font-semibold text-[#e27c3e]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0 break-words text-[0.98rem] font-semibold leading-6 text-[#2d2d2d] sm:text-[1.05rem] sm:leading-7">
                    {item.question}
                  </span>
                </span>

                <ChevronDownIcon
                  className={`mt-1 h-5 w-5 shrink-0 text-[#ea8327] transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                  strokeWidth={2.4}
                />
              </button>
            </h2>

            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              aria-hidden={!isOpen}
              className={`overflow-hidden transition-[max-height,opacity] duration-200 ease-out motion-reduce:transition-none ${
                isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <p className="px-4 pb-5 pl-[3.25rem] text-sm leading-7 text-[#686868] sm:px-6 sm:pb-6 sm:pl-[4.75rem] sm:text-[0.96rem] sm:leading-8">
                {item.answer}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FAQAccordion;
