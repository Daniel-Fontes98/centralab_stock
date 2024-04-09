import { Avatar, AvatarFallback } from "./ui/avatar";

interface Props {
  id: number;
  name: string;
  totalQuantity: number;
  supplier: string;
}

function getFirstAndLastLettersUppercase(str: string): string {
  // Split the string into words
  const words = str.split(" ");

  if (words.length >= 2) {
    // If the string contains two or more words, get the first letter of each word
    const firstLetters = words.map((word) => word.charAt(0).toUpperCase());
    return firstLetters.join("");
  } else {
    // If the string contains only one word, get the first and last letters
    const firstLetter = str.charAt(0).toUpperCase();
    const lastLetter = str.charAt(str.length - 1).toUpperCase();
    return firstLetter + lastLetter;
  }
}

export function formatCurrency(amount: number): string {
  const amountString = amount.toFixed(2);

  const [integerPart, decimalPart] = amountString.split(".");

  const formattedIntegerPart = integerPart?.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ".",
  );

  const formattedDecimalPart = decimalPart ? `,${decimalPart}` : ",00";

  return `${formattedIntegerPart}${formattedDecimalPart} AOA`;
}

export function RecentSales(props: { itemList: Props[] }) {
  const { itemList } = props;
  return (
    <div className="space-y-8">
      {itemList.map((item) => (
        <div
          key={item.id}
          id={item.id.toString()}
          className="flex items-center"
        >
          <Avatar className="h-9 w-9">
            <AvatarFallback>
              {getFirstAndLastLettersUppercase(item.supplier)}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{item.name}</p>
            <p className="text-sm text-muted-foreground">{item.supplier}</p>
          </div>
          <div className="ml-auto font-medium">
            {formatCurrency(item.totalQuantity)}
          </div>
        </div>
      ))}
    </div>
  );
}
