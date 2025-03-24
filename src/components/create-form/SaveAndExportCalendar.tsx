import Link from "next/link";
import GenerateJsonCalendar from "./GenerateJSONCalendar";

export default function SaveAndExportCalendar({calendarId}: {calendarId?: string}) {
  return (
    <>
      <p className="mt-6 text-xs text-center">
        Votre calendrier est automatiquement enregistré dans votre navigateur.
      </p>
      <p className="mt-6 text-xs text-center">
        Vous pouvez accéder à tous vos calendriers depuis <Link className="underline" href="/view">Mes calendriers</Link>.
      </p>
      {calendarId && (
        <div className="mt-6 text-xs text-center">
          <GenerateJsonCalendar calendarId={calendarId} />
        </div>
      )}
    </>
  )
}