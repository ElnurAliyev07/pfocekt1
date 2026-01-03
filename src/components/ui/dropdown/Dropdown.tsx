import React, {
  useState,
  useEffect,
  forwardRef,
  createContext,
  useContext,
} from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { ChevronDown, X } from "lucide-react";
import Button from "../Button";

// Types
export interface DropdownOption {
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  
  onClick?: () => void;
}

export interface DropdownItemProps {
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}

export interface DropdownTriggerProps {
  className?: string;
  children?: React.ReactNode;
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "outline" | "ghost";
  nested?: boolean;
}

export interface DropdownMenuProps {
  children: React.ReactNode;
  placement?: 'bottom-start' | 'bottom-end' | 'bottom' | 'top-start' | 'top-end' | 'top';
  className?: string;
}

export interface DropdownProps {
  disabled?: boolean;
  className?: string;
  breakpoint?: number; // px width threshold for mobile/desktop
  children: React.ReactNode;
}

// Context for sharing state between components
interface DropdownContextType {
  disabled?: boolean;
  isMobile: boolean;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DropdownContext = createContext<DropdownContextType | null>(null);

const useDropdownContext = () => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error("Dropdown components must be used within a Dropdown");
  }
  return context;
};

// Responsive hook
const useResponsive = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < breakpoint);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, [breakpoint]);

  return isMobile;
};

// Base classes for consistent styling
const baseClasses = {
  trigger: {
    base: "inline-flex items-center justify-between rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none",
    size: {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-3 py-2",
      lg: "h-12 px-4 py-3",
    },
    variant: {
      default: "bg-blue-600 text-white hover:bg-blue-700",
      outline:
        "border border-gray-300 bg-white hover:bg-gray-50 hover:text-gray-900",
      ghost: "hover:bg-gray-100 hover:text-gray-900",
    },
  },
  content: {
    base: "bg-white text-gray-900 shadow-lg border border-gray-200 rounded-md overflow-hidden",
    desktop: "z-[1000] min-w-[8rem] max-h-[300px] overflow-y-auto",
    mobile: "fixed bottom-0 top-auto z-[9999] w-full p-0 shadow-xl",
  },
  item: {
    base: "relative flex w-full cursor-pointer select-none items-center py-2 px-3 text-sm outline-none hover:bg-gray-100 focus:bg-gray-100 data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    mobile: "h-12 px-4 text-base border-b border-gray-100 last:border-b-0",
  },
};

// Find DropdownMenu children
const findMenuItems = (children: React.ReactNode): React.ReactNode => {
  let menuItems: React.ReactNode = null;

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === DropdownMenu) {
      menuItems = (child.props as { children: React.ReactNode }).children;
    }
  });

  return menuItems;
};

// Find DropdownTrigger within children
const findTrigger = (children: React.ReactNode): React.ReactElement | null => {
  let trigger: React.ReactElement | null = null;

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === DropdownTrigger) {
      trigger = child;
    }
  });

  return trigger;
};

// DropdownItem Component
export const DropdownItem = forwardRef<HTMLButtonElement, DropdownItemProps>(
  ({ disabled = false, className, icon, children, onClick, ...props }, ref) => {
    const context = useDropdownContext();

    const itemClasses = [
      baseClasses.item.base,
      context.isMobile && baseClasses.item.mobile,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const handleClick = () => {
      if (!disabled) {
        onClick?.();
        context.setOpen(false);
      }
    };

    // Mobile için Dialog içinde normal button
    if (context.isMobile) {
      return (
        <button
          ref={ref}
          type="button"
          onClick={handleClick}
          disabled={disabled}
          className={itemClasses}
          {...props}
        >
          <div className="flex items-center gap-3 w-full">
            {icon && (
              <span className="flex h-5 w-5 items-center justify-center">
                {icon}
              </span>
            )}
            <span className="flex-1 text-left">{children}</span>
          </div>
        </button>
      );
    }

    // Desktop için DropdownMenu.Item
    return (
      <DropdownMenuPrimitive.Item
        className={itemClasses}
        disabled={disabled}
        onSelect={handleClick}
        {...props}
      >
        <div className="flex items-center gap-3 w-full">
          {icon && (
            <span className="flex h-5 w-5 items-center justify-center">
              {icon}
            </span>
          )}
          <span className="flex-1 text-left">{children}</span>
        </div>
      </DropdownMenuPrimitive.Item>
    );
  }
);

DropdownItem.displayName = "DropdownItem";

// DropdownTrigger Component
export const DropdownTrigger = forwardRef<
  HTMLButtonElement,
  DropdownTriggerProps
>(
  (
    {
      className,
      children,
      placeholder = "Select an option...",
      size = "md",
      variant = "outline",
      nested = true,
      ...props
    },
    ref
  ) => {
    const context = useDropdownContext();

    const triggerClasses = [
      baseClasses.trigger.base,
      baseClasses.trigger.size[size],
      baseClasses.trigger.variant[variant],
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const triggerContent = children || (
      <>
        <span className="truncate">{placeholder}</span>
        <ChevronDown
          className={`h-4 w-4 opacity-50 ml-2 transition-transform ${
            context.open ? "rotate-180" : ""
          }`}
        />
      </>
    );

    if (context.isMobile) {
      return (
        <Dialog.Trigger
          className={triggerClasses}
          disabled={context.disabled}
          aria-label={placeholder}
          asChild
        >
          {nested ? (
            <Button className="border-none" size="icon" variant="flat">
              {triggerContent}
            </Button>
          ) : (
            triggerContent
          )}
        </Dialog.Trigger>
      );
    }

    // Desktop için DropdownMenu.Trigger - asChild kullanarak nested button'ı önle
    return (
      <DropdownMenuPrimitive.Trigger
        disabled={context.disabled}
        aria-label={placeholder}
        asChild
        {...props}
      >
        {nested ? (
          <Button className="border-none" size="icon" variant="ghost">
            {triggerContent}
          </Button>
        ) : (
          triggerContent
        )}
      </DropdownMenuPrimitive.Trigger>
    );
  }
);

DropdownTrigger.displayName = "DropdownTrigger";

// DropdownMenu Component
export const DropdownMenu = forwardRef<HTMLDivElement, DropdownMenuProps>(
  ({ children, className, placement = 'bottom', ...props }, ref) => {
    const context = useDropdownContext();

    const contentClasses = [
      baseClasses.content.base,
      context.isMobile
        ? baseClasses.content.mobile
        : baseClasses.content.desktop,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    if (context.isMobile) {
      return (
        <Dialog.Content
          ref={ref}
          className={contentClasses}
          onOpenAutoFocus={(e) => e.preventDefault()}
          {...props}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 p-4 bg-gray-50">
            <Dialog.Title className="text-lg font-semibold text-gray-900">
              Seçin
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                className="rounded-full p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
                aria-label="Kapat"
              >
                <X className="h-5 w-5" />
              </button>
            </Dialog.Close>
          </div>

          {/* Options List */}
          <div className="max-h-[60vh] overflow-y-auto">{children}</div>
        </Dialog.Content>
      );
    }

    const getPlacement = () => {
      switch (placement) {
        case 'bottom-start': return { side: 'bottom' as const, align: 'start' as const };
        case 'bottom-end': return { side: 'bottom' as const, align: 'end' as const };
        case 'bottom': return { side: 'bottom' as const, align: 'center' as const };
        case 'top-start': return { side: 'top' as const, align: 'start' as const };
        case 'top-end': return { side: 'top' as const, align: 'end' as const };
        case 'top': return { side: 'top' as const, align: 'center' as const };
        default: return { side: 'bottom' as const, align: 'start' as const };
      }
    };

    // Desktop için DropdownMenu.Content - scroll engellemesini kapat
    return (
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
         
          ref={ref}
          className={contentClasses}
          {...getPlacement()}
          sideOffset={4}
          onCloseAutoFocus={(e) => e.preventDefault()}
          {...props}
        >
          <div className="p-1">{children}</div>
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    );
  }
);

DropdownMenu.displayName = "DropdownMenu";

// Main Dropdown Component
export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  ({ disabled, className, breakpoint = 768, children, ...props }, ref) => {
    const isMobile = useResponsive(breakpoint);
    const [open, setOpen] = useState(false);

    // SADECE MOBİL İÇİN body scroll'u engelle - desktop'ta engellenmesin
    useEffect(() => {
      if (isMobile && open) {
        const originalStyle = window.getComputedStyle(document.body).overflow;
        document.body.style.overflow = "hidden";

        return () => {
          document.body.style.overflow = originalStyle;
        };
      }
      // Desktop modda scroll engellenmez
    }, [isMobile, open]);

    const contextValue: DropdownContextType = {
      disabled,
      isMobile,
      open,
      setOpen,
    };

    const trigger = findTrigger(children);
    const menuItems = findMenuItems(children);

    if (isMobile) {
      return (
        <DropdownContext.Provider value={contextValue}>
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <div ref={ref} className={className} {...props}>
              {trigger}

              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-[9998] bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                <DropdownMenu>{menuItems}</DropdownMenu>
              </Dialog.Portal>
            </div>
          </Dialog.Root>
        </DropdownContext.Provider>
      );
    }

    // Desktop için DropdownMenu.Root kullan - scroll engellemesini kapat
    return (
      <DropdownContext.Provider value={contextValue}>
        <DropdownMenuPrimitive.Root
          open={open}
          onOpenChange={setOpen}
          modal={false}
        >
          <div ref={ref} className={className} {...props}>
            {trigger}
            <DropdownMenu>{menuItems}</DropdownMenu>
          </div>
        </DropdownMenuPrimitive.Root>
      </DropdownContext.Provider>
    );
  }
);

Dropdown.displayName = "Dropdown";

// Example usage component
export const DropdownExample: React.FC = () => {
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [selectedValue2, setSelectedValue2] = useState<string>("");
  const [selectedValue3, setSelectedValue3] = useState<string>("");

  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900">
        Responsive Dropdown Component Örnekleri
      </h2>

      <div className="space-y-6">
        {/* Temel kullanım */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Temel Dropdown
          </label>
          <Dropdown>
            <DropdownTrigger placeholder="Bir meyve seçin..." />
            <DropdownMenu>
              <DropdownItem icon="🍎" onClick={() => setSelectedValue("apple")}>
                Apple
              </DropdownItem>
              <DropdownItem
                icon="🍌"
                onClick={() => setSelectedValue("banana")}
              >
                Banana
              </DropdownItem>
              <DropdownItem
                icon="🍊"
                onClick={() => setSelectedValue("orange")}
              >
                Orange
              </DropdownItem>
              <DropdownItem
                icon="🍇"
                disabled
                onClick={() => setSelectedValue("grape")}
              >
                Grape (Disabled)
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        {/* Custom trigger */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Özel Trigger ile Dropdown
          </label>
          <Dropdown>
            <DropdownTrigger size="lg" variant="default">
              <div className="flex items-center gap-2 w-full">
                <span>🚀</span>
                <span className="flex-1 text-left">
                  {selectedValue2
                    ? `Seçilen: ${selectedValue2}`
                    : "Framework seçin"}
                </span>
                <ChevronDown className="h-4 w-4" />
              </div>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem
                icon="⚛️"
                onClick={() => setSelectedValue2("React")}
              >
                React
              </DropdownItem>
              <DropdownItem
                icon="💚"
                onClick={() => setSelectedValue2("Vue.js")}
              >
                Vue.js
              </DropdownItem>
              <DropdownItem
                icon="🅰️"
                onClick={() => setSelectedValue2("Angular")}
              >
                Angular
              </DropdownItem>
              <DropdownItem
                icon="🧡"
                onClick={() => setSelectedValue2("Svelte")}
              >
                Svelte
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        {/* Complex content */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Karmaşık İçerik
          </label>
          <Dropdown>
            <DropdownTrigger
              placeholder="Plan seçin..."
              variant="outline"
              size="md"
            />
            <DropdownMenu>
              <DropdownItem
                icon="🆓"
                onClick={() => setSelectedValue3("Free Plan")}
              >
                <div className="flex justify-between items-center w-full">
                  <div>
                    <div className="font-medium">Free Plan</div>
                    <div className="text-xs text-gray-500">
                      Temel özellikler
                    </div>
                  </div>
                  <span className="text-sm font-bold text-green-600">$0</span>
                </div>
              </DropdownItem>
              <DropdownItem
                icon="⭐"
                onClick={() => setSelectedValue3("Pro Plan")}
              >
                <div className="flex justify-between items-center w-full">
                  <div>
                    <div className="font-medium">Pro Plan</div>
                    <div className="text-xs text-gray-500">
                      Gelişmiş özellikler
                    </div>
                  </div>
                  <span className="text-sm font-bold text-blue-600">$29</span>
                </div>
              </DropdownItem>
              <DropdownItem
                icon="🏢"
                onClick={() => setSelectedValue3("Enterprise")}
              >
                <div className="flex justify-between items-center w-full">
                  <div>
                    <div className="font-medium">Enterprise</div>
                    <div className="text-xs text-gray-500">Özel çözümler</div>
                  </div>
                  <span className="text-sm font-bold text-purple-600">
                    Custom
                  </span>
                </div>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        {/* Disabled example */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700">
            Devre Dışı Dropdown
          </label>
          <Dropdown disabled>
            <DropdownTrigger
              placeholder="Devre dışı..."
              size="sm"
              variant="ghost"
            />
            <DropdownMenu>
              <DropdownItem onClick={() => {}}>Seçenek 1</DropdownItem>
              <DropdownItem onClick={() => {}}>Seçenek 2</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      </div>

      {/* Selected values display */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg space-y-2 border">
        <h3 className="font-semibold text-gray-900 mb-3">Seçilen Değerler:</h3>
        <p className="text-sm">
          Temel Dropdown:{" "}
          <strong className="text-blue-600">
            {selectedValue || "Hiçbiri"}
          </strong>
        </p>
        <p className="text-sm">
          Özel Trigger:{" "}
          <strong className="text-blue-600">
            {selectedValue2 || "Hiçbiri"}
          </strong>
        </p>
        <p className="text-sm">
          Karmaşık İçerik:{" "}
          <strong className="text-blue-600">
            {selectedValue3 || "Hiçbiri"}
          </strong>
        </p>
      </div>

      {/* Test için uzun içerik */}
      <div className="mt-12 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-3">Scroll Test Alanı</h3>
        <p className="text-sm text-blue-800 mb-2">
          Bu alan desktop'ta dropdown açılırken scroll'un normal çalıştığını
          test etmek için. Sayfayı aşağı kaydırın ve dropdown'ları test edin -
          Radix UI otomatik pozisyonlama yapar.
        </p>
        {Array.from({ length: 20 }).map((_, i) => (
          <p key={i} className="text-sm text-blue-700 mb-2">
            Bu {i + 1}. test paragrafı. Desktop'ta dropdown Radix UI tarafından
            otomatik pozisyonlanır ve scroll edilebilir.
          </p>
        ))}
      </div>
    </div>
  );
};
