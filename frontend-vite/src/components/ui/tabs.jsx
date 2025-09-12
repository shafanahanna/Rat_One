import React from "react";

const Tabs = ({ defaultValue, value, onValueChange, className, children, ...props }) => {
  const [selectedValue, setSelectedValue] = React.useState(value || defaultValue);

  React.useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  const handleValueChange = (newValue) => {
    if (value === undefined) {
      setSelectedValue(newValue);
    }
    onValueChange?.(newValue);
  };

  return (
    <div className={className} {...props}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        
        return React.cloneElement(child, {
          selectedValue,
          onValueChange: handleValueChange,
        });
      })}
    </div>
  );
};

const TabsList = ({ className, children, selectedValue, onValueChange, ...props }) => {
  return (
    <div className={`flex space-x-1 ${className || ""}`} role="tablist" {...props}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        
        return React.cloneElement(child, {
          selectedValue,
          onValueChange,
        });
      })}
    </div>
  );
};

const TabsTrigger = ({ className, value, selectedValue, onValueChange, children, ...props }) => {
  const isSelected = selectedValue === value;
  
  return (
    <button
      role="tab"
      aria-selected={isSelected}
      data-state={isSelected ? "active" : "inactive"}
      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all outline-none
        ${isSelected 
          ? "bg-white text-primary-600 shadow-sm" 
          : "text-gray-500 hover:text-gray-700"}
        ${className || ""}`}
      onClick={() => onValueChange(value)}
      {...props}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ className, value, selectedValue, children, ...props }) => {
  const isSelected = selectedValue === value;
  
  if (!isSelected) return null;
  
  return (
    <div
      role="tabpanel"
      data-state={isSelected ? "active" : "inactive"}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
};

export { Tabs, TabsList, TabsTrigger, TabsContent };
