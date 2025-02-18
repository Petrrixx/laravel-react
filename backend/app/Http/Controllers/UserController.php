<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    /**
     * Získanie cesty k JSON súboru s dátami.
     */
    private function getJsonPath(): string
    {
        return 'users.json';
    }

    /**
     * Načítanie používateľov zo súboru.
     */
    private function loadUsers(): array
    {
        $disk = Storage::disk('local'); // Disk s rootom storage/app/public
        if (!$disk->exists($this->getJsonPath())) {
            // Ak súbor neexistuje, vytvoríme ho s počiatočnými dátami
            $initialData = [
                [
                    "id" => 1,
                    "name" => "Ján",
                    "age" => 25,
                    "gender" => "Muž"
                ],
                [
                    "id" => 2,
                    "name" => "Anna",
                    "age" => 30,
                    "gender" => "Žena"
                ],
                [
                    "id" => 3,
                    "name" => "Peter",
                    "age" => 40,
                    "gender" => "Muž"
                ],
                [
                    "id" => 4,
                    "name" => "Eva",
                    "age" => 22,
                    "gender" => "Žena"
                ]
            ];
            $disk->put($this->getJsonPath(), json_encode($initialData, JSON_PRETTY_PRINT));
        }
        $data = $disk->get($this->getJsonPath());
        $users = json_decode($data, true);
        return $users ?: [];
    }

    /**
     * Uloženie používateľov do súboru.
     */
    private function saveUsers(array $users): void
    {
        Storage::disk('local')->put($this->getJsonPath(), json_encode($users, JSON_PRETTY_PRINT));
    }

    // GET /users – vráti zoznam používateľov
    public function index()
    {
        $users = $this->loadUsers();
        return response()->json($users);
    }

    // GET /users/search?query=... – vyhľadávanie používateľov podľa mena, veku alebo pohlavia
    public function search(Request $request)
    {
        $query = strtolower($request->query('query', ''));
        $users = $this->loadUsers();
        $filtered = array_filter($users, function ($user) use ($query) {
            return strpos(strtolower($user['name']), $query) !== false ||
                   strpos((string)$user['age'], $query) !== false ||
                   strpos(strtolower($user['gender']), $query) !== false;
        });
        return response()->json(array_values($filtered));
    }

    // DELETE /users/{id} – odstránenie používateľa podľa ID
    public function destroy($id)
    {
        $users = $this->loadUsers();
        $found = false;
        foreach ($users as $index => $user) {
            if ((int)$user['id'] === (int)$id) {
                $found = true;
                unset($users[$index]);
                break;
            }
        }

        if (!$found) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Preindexovanie poľa a uloženie zmien
        $users = array_values($users);
        $this->saveUsers($users);

        return response()->json([
            'message' => 'User deleted',
            'users'   => $users
        ]);
    }

    // PUT /users/{id} – aktualizácia používateľa
    public function update(Request $request, $id)
    {
        $users = $this->loadUsers();
        $found = false;
        $updatedUser = null;

        foreach ($users as $index => $user) {
            if ((int)$user['id'] === (int)$id) {
                $found = true;
                // Aktualizácia údajov - použijeme hodnoty z requestu, ak sú poskytnuté
                $users[$index]['name'] = $request->input('name', $user['name']);
                $users[$index]['age'] = $request->input('age', $user['age']);
                $users[$index]['gender'] = $request->input('gender', $user['gender']);
                $updatedUser = $users[$index];
                break;
            }
        }

        if (!$found) {
            return response()->json(['message' => 'User not found'], 404);
        }

        // Uloženie zmien
        $this->saveUsers($users);

        return response()->json([
            'message' => 'User updated',
            'user' => $updatedUser
        ]);
    }
}
