import {
  Item,
  ItemGroup,
  ItemContent,
  ItemDescription,
  ItemTitle,
  ItemActions,
} from "@/components/ui/item"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import DeleteDialog from "./DeleteDialog"

interface FoodEntryListProps {
  nutritionValues: NutritionValues[]
  onSuccessDelete: () => Promise<void>
}

export interface NutritionValues {
  id: string
  name: string
  protein: number
  fat: number
  carbs: number
  calories: number
  amount: number
}

const FoodEntryList = ({
  nutritionValues,
  onSuccessDelete,
}: FoodEntryListProps) => {
  return (
    <ItemGroup>
      {nutritionValues.map((item) => (
        <Item key={item.id} variant="outline">
          <ItemContent>
            <ItemTitle>
              {item.name}
              <span className="text-muted-foreground">
                {Number(item.amount)} г
              </span>
            </ItemTitle>
          </ItemContent>
          <ItemContent>
            <ItemDescription className="flex gap-4">
              <HoverCard>
                <HoverCardTrigger
                  render={
                    <span className="w-18 text-center text-(--protein-color)">
                      {Math.round(Number(item.protein) * 10) / 10}
                    </span>
                  }
                />
                <HoverCardContent
                  className="w-auto text-(--protein-color)"
                  side="top"
                  align="center"
                >
                  Белки
                </HoverCardContent>
              </HoverCard>
              <HoverCard>
                <HoverCardTrigger
                  render={
                    <span className="w-18 text-center text-(--fat-color)">
                      {Math.round(Number(item.fat) * 10) / 10}
                    </span>
                  }
                />
                <HoverCardContent
                  className="w-auto text-(--fat-color)"
                  side="top"
                  align="center"
                >
                  Жиры
                </HoverCardContent>
              </HoverCard>
              <HoverCard>
                <HoverCardTrigger
                  render={
                    <span className="w-18 text-center text-(--carbs-color)">
                      {Math.round(Number(item.carbs) * 10) / 10}
                    </span>
                  }
                />
                <HoverCardContent
                  className="w-auto text-(--carbs-color)"
                  side="top"
                  align="center"
                >
                  Углеводы
                </HoverCardContent>
              </HoverCard>
              <span className="w-18 text-center text-primary">
                {Math.round(Number(item.calories))} ккал
              </span>
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <DeleteDialog
              foodName={item.name}
              foodEntryId={item.id}
              onSuccessDelete={onSuccessDelete}
            />
          </ItemActions>
        </Item>
      ))}
    </ItemGroup>
  )
}

export default FoodEntryList
