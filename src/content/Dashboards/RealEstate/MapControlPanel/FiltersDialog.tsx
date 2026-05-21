import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import MainControls from '../MapControls/MainControls';

type FiltersDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

// Mobile-only filters surface. The desktop variant lives inline in
// MapControlPanel as a collapsible card; on small viewports the same
// MainControls body slides up from the bottom as a sheet, mirroring
// the recent CompsFilter rebuild's shadcn pattern.
const FiltersDialog = ({ open, setOpen }: FiltersDialogProps) => {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="bottom"
        className="block md:hidden h-[85vh] p-0 flex flex-col font-poppins"
      >
        <SheetHeader className="px-4 py-3 border-b">
          <SheetTitle className="font-poppins">Filters</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex-1 px-4 py-4">
          <MainControls />
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default FiltersDialog;
