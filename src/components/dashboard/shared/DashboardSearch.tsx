import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { Search, Dog, Calendar, MessageCircle, Settings, User, Euro, Star, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SearchItem {
  id: string;
  type: "action" | "page" | "shortcut";
  label: string;
  description?: string;
  icon: any;
  action: () => void;
  keywords?: string[];
}

interface DashboardSearchProps {
  items: SearchItem[];
  placeholder?: string;
}

const DashboardSearch = ({ items, placeholder = "Rechercher..." }: DashboardSearchProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredItems = items.filter(item => {
    const searchLower = search.toLowerCase();
    return (
      item.label.toLowerCase().includes(searchLower) ||
      item.description?.toLowerCase().includes(searchLower) ||
      item.keywords?.some(k => k.toLowerCase().includes(searchLower))
    );
  });

  const groupedItems = {
    actions: filteredItems.filter(i => i.type === "action"),
    pages: filteredItems.filter(i => i.type === "page"),
    shortcuts: filteredItems.filter(i => i.type === "shortcut")
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full max-w-md justify-start gap-3 text-muted-foreground h-12 rounded-2xl border-2 border-dashed hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group"
        >
          <Search className="h-4 w-4 group-hover:text-primary transition-colors" />
          <span>{placeholder}</span>
          <kbd className="ml-auto hidden md:inline-flex h-6 items-center gap-1 rounded-lg border bg-muted px-2 font-mono text-xs text-muted-foreground">
            ⌘K
          </kbd>
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 max-w-2xl overflow-hidden">
        <Command className="rounded-lg">
          <div className="flex items-center border-b px-4">
            <Search className="h-5 w-5 text-muted-foreground shrink-0" />
            <CommandInput 
              placeholder="Que souhaitez-vous faire ?" 
              value={search}
              onValueChange={setSearch}
              className="border-0 focus:ring-0 text-lg"
            />
          </div>
          <CommandList className="max-h-[400px]">
            <CommandEmpty>
              <div className="py-12 text-center">
                <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
                <p className="text-muted-foreground">Aucun résultat pour "{search}"</p>
              </div>
            </CommandEmpty>
            
            {groupedItems.actions.length > 0 && (
              <CommandGroup heading="Actions rapides">
                {groupedItems.actions.map((item) => (
                  <CommandItem
                    key={item.id}
                    onSelect={() => { item.action(); setOpen(false); }}
                    className="flex items-center gap-3 p-3 cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.label}</p>
                      {item.description && (
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      )}
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            
            {groupedItems.pages.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup heading="Pages">
                  {groupedItems.pages.map((item) => (
                    <CommandItem
                      key={item.id}
                      onSelect={() => { item.action(); setOpen(false); }}
                      className="flex items-center gap-3 p-3 cursor-pointer"
                    >
                      <item.icon className="h-5 w-5 text-muted-foreground" />
                      <span>{item.label}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}

            {groupedItems.shortcuts.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup heading="Raccourcis">
                  {groupedItems.shortcuts.map((item) => (
                    <CommandItem
                      key={item.id}
                      onSelect={() => { item.action(); setOpen(false); }}
                      className="flex items-center gap-3 p-3 cursor-pointer"
                    >
                      <item.icon className="h-5 w-5 text-muted-foreground" />
                      <span>{item.label}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
};

export default DashboardSearch;
