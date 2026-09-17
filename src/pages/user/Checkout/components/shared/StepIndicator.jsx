import React from "react";
import { CHECKOUT_STEPS } from "../../../../constants";
import { useCheckoutNavigation } from "../../hooks/useCheckoutNavigation";
import { useCurrentStep, useCompletedSteps } from "../../store/Selectors";
import { useAuthStore } from "../../../Auth/store/AuthStore";
import { useCheckoutStore } from "../../store/CheckoutStore";

const StepIndicator = ({ children }) => {
  const currentStep = useCurrentStep();
  const completedSteps = useCompletedSteps();
  const { navigateToStep } = useCheckoutNavigation();

  const user = useAuthStore((state) => state.user)


  const addressStep = useCheckoutStore((s) => s.stepData.address);

  const addressSnapshot = addressStep?.addressSnapshot;
  console.log(addressSnapshot)

  // const visibleSteps = CHECKOUT_STEPS.filter(step =>
  //   completedSteps.includes(step.id)
  // );
  const visibleSteps = CHECKOUT_STEPS;

  return (
    <div className="w-full   ">
      <ul className="space-y-4">
        {visibleSteps.map((step) => {
          const isCompleted = completedSteps.includes(step.id);
          const isActive = step.id === currentStep;
          const isClickable = step.id <= completedSteps.length;
          // explicit auth check or handling if needed, but 'auth' is -1.
          // If currentStep is 0 (Address), auth (-1) checks:
          // isCompleted: no? (completedSteps usually has 0, 1 etc?)
          // actually auth step logic in checkout store?
          // The auth step is a "dummy" step in constants.js. It might not be in checkout store logic.
          // But visually it should probably appear as completed if we are in checkout (since we enforced auth).

          const isAuthStep = step.key === "auth";
          const isStepCompleted = isCompleted || (isAuthStep && user); // Auth is always done if we encounter it here likely
          const isStepActive = isActive; // Strict active check

          return (
            <React.Fragment key={step.id}>
              <li
                className="flex items-center justify-between bg-[#F8F8F8] rounded-xl px-4 py-4  "
              >
                <div className="flex items-center gap-3">
                  {/* Step Number */}
                  <div
                    className={`w-8 h-8 flex items-center px-4 justify-center rounded-full text-sm font-semibold
                      ${isStepCompleted || isStepActive
                        ? "bg-black text-white"
                        : "bg-gray-200 text-gray-500"
                      }
                    `}
                  >
                    {/* For Auth step, maybe show a checkmark or just number/icon? keeping simple */}
                    {step.id + 1 <= 0 ? (isStepCompleted ? "✓" : "1") : step.id + 1}
                  </div>

                  {/* Label */}
                  <div className="flex flex-col">
                    <span
                      className={`font-medium
                      ${isStepCompleted || isStepActive
                          ? "text-gray-900"
                          : "text-gray-400"
                        }
                    `}
                    >
                      {step.label}
                    </span>
                    {step.key === "auth" && (
                      user?.isGuest ? (
                        <span className="text-sm text-gray-600">
                          Logged in as Guest
                        </span>
                      ) : (
                        <span className="text-sm text-gray-600">
                          Logged in as {user.FullName} ({user.Email})
                        </span>
                      )
                    )}

                    {step.key === "address" && addressSnapshot && (
                      <span className="text-sm text-gray-600">
                        {addressSnapshot.Address}-{addressSnapshot.City}-{addressSnapshot.PhoneNumber}
                      </span>
                    )}

                  </div>
                </div>

                {/* Change Button */}
                {isCompleted && (
                  <button
                    onClick={() => navigateToStep(step.id)}
                    disabled={!isClickable}
                    className="text-sm text-black hover:underline disabled:text-gray-400"
                  >
                    Change
                  </button>
                )}
              </li>

              {/* Render active step content right after the active step */}
              {isStepActive && children && (
                <div className="mt-4 mb-4">
                  {children}
                </div>
              )}
            </React.Fragment>
          );
        })}

      </ul>
    </div>
  );
};

export default StepIndicator;
